"""Module providing access to args """
import sys
import unittest
from pyspark.context import SparkContext
from pyspark.sql.functions import col, lit, when
from pyspark.sql import functions as F
from functions import join_defective_actualcount, overwrite_editable_fields, join_list_or_none_to_str

try:
    from awsglue.transforms import *
    from awsglue.utils import getResolvedOptions
    from awsglue.context import GlueContext
    from awsglue.job import Job
    from awsglue.dynamicframe import DynamicFrame
except ModuleNotFoundError:
    print("This is not an AWS Glue environment")

class Test(unittest.TestCase):
    """Class to unit test functions"""
    def set_up(self):
        """Function creating a glue and spark context"""
        sys.argv.append("--JOB_NAME")
        sys.argv.append("test_count")
        args = getResolvedOptions(sys.argv, ["JOB_NAME"])
        self.context = GlueContext(SparkContext.getOrCreate())
        job = Job(self.context)
        job.init(args["JOB_NAME"], args)
        job.commit()

    def tear_down(self):
        """Function stopping spark session"""
        self.context.spark_session.stop()

    def test_join_defective_actualcount(self):
        """Function testing the joining of defectives to actualcounts"""
        spark = self.context.spark_session
        actualcount_data = [
            ("u1", "u1", "p1", "2023-01-01T01:00:00.000Z", "2023-01-01T02:00:00.000Z"),
            ("u1", "u1", "p1", "2023-01-01T02:00:00.000Z", "2023-01-01T03:00:00.000Z"),
            ("u1", "u1", "p2", "2023-01-01T01:00:00.000Z", "2023-01-01T02:00:00.000Z"),
        ]
        actualcount_df = spark.createDataFrame(
            actualcount_data, ["unitid", ".unitid", "partid", "datetimestartutc", "datetimeendutc"]
        )
        def_data = [
            ("u1", "p1", "2023-01-01T01:00:00.000Z", 1),
            ("u2", "p1", "2023-01-01T01:00:00.000Z", 1),
            ("u1", "p1", "2023-01-01T01:30:00.000Z", 2),
            ("u1", "p1", "2023-01-01T02:00:00.000Z", 10),
        ]
        def_df = spark.createDataFrame(
            def_data, ["unitid", "partid", "datetimeutc", "count"]
        )
        target_data = [
            ("u1", "p1", "2023-01-01T01:00:00.000Z", "2023-01-01T02:00:00.000Z", 3),
            ("u1", "p1", "2023-01-01T02:00:00.000Z", "2023-01-01T03:00:00.000Z", 10),
            ("u1", "p2", "2023-01-01T01:00:00.000Z", "2023-01-01T02:00:00.000Z", None),
        ]
        target_df = spark.createDataFrame(
            target_data,
            ["unitid", "partid", "datetimestartutc", "datetimeendutc", "count"],
        ).withColumn("datetimeendutc", F.col("datetimeendutc").cast("timestamp")).withColumn("datetimestartutc", F.col("datetimestartutc").cast("timestamp"))
        joined_df = join_defective_actualcount(def_df, actualcount_df)
        self.assertTrue(
            joined_df.select(*target_df.columns).exceptAll(target_df).count() == 0,
            "Defectives should be properly joined to Actualcounts",
        )
        
    def test_overwrite_editable_fields(self):
        """Function testing the overwriting editable fields from templates"""
        spark = self.context.spark_session
        # 1: disruption with matching template
        # 2: template for 1
        # 3: disruption with no template
        # 4: generic disruption
        disruption_data = [
            ("1", "2", "no", "description1", "dislocation1", "dislocationtype1", "dislocationspecification1"),
            ("2", "000", "yes", "description2", "dislocation2", "dislocationtype2", "dislocationspecification2"),
            ("3", "5", "no", "description3", "dislocation3", "dislocationtype3", "dislocationspecification3"),
            ("4", "genericDisruption", "no", "description4", "dislocation4", "dislocationtype4", "dislocationspecification4"),
        ]
        disruption_df = spark.createDataFrame(
            disruption_data, ["id", "templateid", "template", "description", "dislocation", "dislocationtype", "dislocationspecification"]
        )
        target_data = [
            ("1", "2", "no", "description2", "dislocation2", "dislocationtype2", "dislocationspecification2"),
            ("2", "000", "yes", "description2", "dislocation2", "dislocationtype2", "dislocationspecification2"),
            ("3", "5", "no", "description3", "dislocation3", "dislocationtype3", "dislocationspecification3"),
            ("4", "genericDisruption", "no", "description4", "dislocation4", "dislocationtype4", "dislocationspecification4"),
        ]
        target_df = spark.createDataFrame(
            target_data,
            ["id", "templateid", "template", "description", "dislocation", "dislocationtype", "dislocationspecification"],
        )
        joined_df = overwrite_editable_fields(disruption_df)
        self.assertTrue(
            joined_df.select(*target_df.columns).exceptAll(target_df).count() == 0,
            "Editable fields should be properly overwritten with templates",
        )

    def test_join_list_or_none_to_str_none(self):
        """Function testing the joining of a list with a none value"""
        self.assertEqual(join_list_or_none_to_str(None), "", "Null lists should be returned as empty")

    def test_join_list_or_none_to_str_empty(self):
        """Function testing the joining of a list with an empty list"""
        self.assertEqual(join_list_or_none_to_str([]), "", "Empty lists should be returned as empty")

    def test_join_list_or_none_to_str_list(self):
        """Function testing the joining of a list with a list"""
        lis = [["element1", 1], ["element2", 2], ["", 3], ["last", 4]]
        self.assertEqual(join_list_or_none_to_str(lis), "element1;element2;;last", "Lists should be properly joined")

if __name__ == "__main__":
    x = Test()
    x.set_up()
    x.test_join_defective_actualcount()
    x.test_overwrite_editable_fields()

    x.test_join_list_or_none_to_str_none()
    x.test_join_list_or_none_to_str_empty()
    x.test_join_list_or_none_to_str_list()

    x.tear_down()


