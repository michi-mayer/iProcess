import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

## @params: [JOB_NAME]
args = getResolvedOptions(sys.argv, ['JOB_NAME'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)
## @type: DataSource
## @args: [database = "disruptions_view", table_name = "pwk_crawled_disruption_675orbcw3bg5xovk7fvhcdicja_masterpwk", transformation_ctx = "DataSource0"]
## @return: DataSource0
## @inputs: []
DataSource0 = glueContext.create_dynamic_frame.from_catalog(database = "disruptions_view", table_name = "pwk_crawled_disruption_675orbcw3bg5xovk7fvhcdicja_masterpwk", transformation_ctx = "DataSource0")
## @type: DropFields
## @args: [paths = ["__typename"], transformation_ctx = "Transform0"]
## @return: Transform0
## @inputs: [frame = DataSource0]
Transform0 = DropFields.apply(frame = DataSource0, paths = ["__typename"], transformation_ctx = "Transform0")
## @type: DataSink
## @args: [connection_type = "s3", format = "json", connection_options = {"path": "s3://s3-vw-poc-quicksight/pwk_glued_disruption/", "partitionKeys": []}, transformation_ctx = "DataSink0"]
## @return: DataSink0
## @inputs: [frame = Transform0]
DataSink0 = glueContext.write_dynamic_frame.from_options(frame = Transform0, connection_type = "s3", format = "json", connection_options = {"path": "s3://s3-vw-poc-quicksight/pwk_glued_disruption/", "partitionKeys": []}, transformation_ctx = "DataSink0")
job.commit()