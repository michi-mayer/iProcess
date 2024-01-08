import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue import DynamicFrame
from pyspark.sql import functions as F, Row
from pyspark.sql.types import StringType
from functions import join_defective_actualcount, overwrite_editable_fields, join_list_or_none_to_str

sc = SparkContext()
glue_context = GlueContext(sc)
spark = glue_context.spark_session
job = Job(glue_context)
args = getResolvedOptions(sys.argv, ["JOB_NAME"])
job.init(args["JOB_NAME"], args)

oee_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_oee_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

defective_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_defective_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

part_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_part_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

disruption_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_disruption_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

unit_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_unit_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

actualcount_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_actualcount_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

cyclestation_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_cyclestation_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

team_crawled = glue_context.create_dynamic_frame.from_catalog(
    database="qa",
    table_name="crawled_team_oyzy6jx4evdwxjheqzfu2kjdj4_stag",
)

oee = oee_crawled.toDF()
defective = defective_crawled.toDF()
part = part_crawled.toDF()
disruption = disruption_crawled.toDF()
unit = unit_crawled.toDF()
actualcount = actualcount_crawled.toDF()
cyclestation = cyclestation_crawled.toDF()
team = team_crawled.toDF()

# Select & rename id, name, partnumber
part = part.select(F.col("id").alias("partid"), F.col("name").alias("partname"), F.col("partnumber"))

# Drop __typename, isReviewed, startTimeDateUTC#endTimeDateUTC, unitName
oee = oee.drop(
    "__typename",
    "actualCountSum",
    "defectiveCountSum",
    "disruptionDurationSum",
    "isReviewed",
    "netOperatingTimeInMinutes",
    "quotaSum",
    "startTimeDateUTC#endTimeDateUTC",
    "targetCycleTimeInMinutes",
    "unitName"
)
# Cast string to timestamp
oee = (
    oee.withColumn("starttimedateutc", F.col("starttimedateutc").cast("timestamp"))
    .withColumn("endtimedateutc", F.col("endtimedateutc").cast("timestamp"))
    .withColumn("createdat", F.col("createdat").cast("timestamp"))
    .withColumn("updatedat", F.col("updatedat").cast("timestamp"))
)

# Cast string to timestamp, long to int, string to boolean
defective = (
    defective.withColumn("datetimeutc", F.col("datetimeutc").cast("timestamp"))
    .withColumn("count", F.col("count").cast("int"))
    .withColumn("createdat", F.col("createdat").cast("timestamp"))
    .withColumn("deleted", F.col("deleted").cast("boolean"))
    .withColumn("updatedat", F.col("updatedat").cast("timestamp"))
)
# Remove all deleted defectives
defective = defective.filter(F.col("deleted") == False)
# Drop __typename, unitname, deleted
defective = defective.drop("__typename", "unitname", "deleted")

# Drop __typename, attachments, index, segmentId, templateIssues
disruption = disruption.drop(
    "__typename", "attachments", "index", "segmentId", "templateIssues"
)
# Cast string to timestamp, string to boolean
disruption = (
    disruption.withColumn("starttimedateutc", F.col("starttimedateutc").cast("timestamp"))
    .withColumn("endtimedateutc", F.col("endtimedateutc").cast("timestamp"))
    .withColumn("createdat", F.col("createdat").cast("timestamp"))
    .withColumn("updatedat", F.col("updatedat").cast("timestamp"))
    .withColumn("deleted", F.col("deleted").cast("boolean"))
    .withColumn("isSolved", F.when(F.col("isSolved") == "yes", True).otherwise(False))
)
# Join issues together
join_list_or_none_to_str_udf = F.udf(join_list_or_none_to_str, StringType())
disruption = disruption.withColumn("issues", join_list_or_none_to_str_udf(F.col("issues")))

# Select & rename columns
unitid_unitname = unit.select(F.col("id").alias("unitid"), F.col("name").alias("unitname"))

# Drop __typename, actualCountFrom, actualCountUntil, deleted, downtime, ioVehicle, lastPieceNumber, unitId#dateTimeStartUTC, unitId#shift, unitName
actualcount = actualcount.drop(
    "__typename",
    "actualCountFrom",
    "actualCountUntil",
    "defective",
    "deleted",
    "downtime",
    "ioVehicle",
    "lastPieceNumber",
    "unitId#dateTimeStartUTC",
    "unitId#shift",
    "unitName",
)
# Cast string to timestamp, long to int
actualcount = (
    actualcount.withColumn("createdat", F.col("createdat").cast("timestamp"))
    .withColumn("datetimestartutc", F.col("datetimestartutc").cast("timestamp"))
    .withColumn("datetimeendutc", F.col("datetimeendutc").cast("timestamp"))
    .withColumn("updatedat", F.col("updatedat").cast("timestamp"))
    .withColumn("quota", F.col("quota").cast("int"))
    .withColumn("actualcount", F.col("actualcount").cast("int"))
    .withColumn("vehiclenumber", F.col("vehiclenumber").cast("string"))
)

# Select & rename id, name, partnumber
teamid_teamname = team.select(F.col("id").alias("teamid"), F.col("name").alias("teamname"))

# Join units to OEE
oee_unit_join = oee.join(unitid_unitname, ["unitid"], how="left")

# Join units to defective
defective_unit_join = defective.join(unitid_unitname, ["unitid"], how="left")

# Join units to actualcount
actualcount_unit_join = actualcount.join(unitid_unitname, ["unitid"], how="left")

# join defectives to actual counts per timeslot
actualcount_unit_defective_join = join_defective_actualcount(
    defective, actualcount_unit_join
)

# join units to disruption and drop rows with missing unitnames
disruption_unit_join = disruption.join(unitid_unitname, ["unitid"], how="left")
disruption_unit_join = disruption_unit_join.na.drop(subset=["unitname"])

# join teams to disruption and map missing team to "Kein Team"
disruption_unit_team_join = disruption_unit_join.join(teamid_teamname, ["teamid"], how="left")
disruption_unit_team_join = disruption_unit_team_join.fillna("0_Kein Team", subset=["teamname"])

# join name of originator to disruption
originatorid_originatorname = teamid_teamname.withColumnRenamed("teamid", "originatorid").withColumnRenamed("teamname", "originatorname")
## use teamid for originatorid if disruption is from own team
disruption_unit_team_originator_join = disruption_unit_team_join.withColumn("originatorid", F.when(F.col("originatorid").isNull(), F.col("teamid")).otherwise(F.col("originatorid")))
disruption_unit_team_originator_join = disruption_unit_team_originator_join.join(originatorid_originatorname, ["originatorid"], how="left")
disruption_unit_team_originator_join = disruption_unit_team_originator_join.fillna("0_Kein Team", subset=["originatorname"])
# join parts to disruption
disruption_unit_team_originator_part_join = disruption_unit_team_originator_join.join(part, ["partid"], how="left")

# join cyclestation to disruption and map 000 to "Anlagenspezifisch" and missing values to "Kein Takt/Station"
cyclestation = cyclestation.select(
    F.col("id").alias("cycleStationid"), F.col("name").alias("cycleStation")
)
cyclestation = cyclestation.union(spark.createDataFrame([("00000000-0000-0000-0000-000000000000", "0_Anlagenspezifisch")], ["cycleStationid", "cycleStation"]))
disruption_unit_team_originator_part_cyclestation_join = disruption_unit_team_originator_part_join.join(
    cyclestation, ["cycleStationid"], how="left_outer"
)
disruption_unit_team_originator_part_cyclestation_join = disruption_unit_team_originator_part_cyclestation_join.fillna("1_Kein Takt/Station", subset=["cycleStation"])

# overwrite editable fields such as descriptions with values from templates
disruption_unit_team_originator_part_cyclestation_join = overwrite_editable_fields(disruption_unit_team_originator_part_cyclestation_join)

# lowercase columns for databrew
defective_unit_join = defective_unit_join.select([defective_unit_join[col].alias(col.lower()) for col in defective_unit_join.columns])
defective_unit_join = defective_unit_join.withColumnRenamed("defectivegrid", "defectiveGrid") \
    .withColumnRenamed("defectivecause", "defectiveCause") \
    .withColumnRenamed("defectiveLocation", "defectiveLocation")
actualcount_unit_defective_join = actualcount_unit_defective_join.select([actualcount_unit_defective_join[col].alias(col.lower()) for col in actualcount_unit_defective_join.columns])
disruption_unit_team_originator_part_cyclestation_join = disruption_unit_team_originator_part_cyclestation_join.select([disruption_unit_team_originator_part_cyclestation_join[col].alias(col.lower()) for col in disruption_unit_team_originator_part_cyclestation_join.columns])
disruption_unit_team_originator_part_cyclestation_join = disruption_unit_team_originator_part_cyclestation_join.withColumnRenamed("shifttype", "shiftType")
oee_unit_join = oee_unit_join.select([oee_unit_join[col].alias(col.lower()) for col in oee_unit_join.columns])
unit = unit.select([unit[col].alias(col.lower()) for col in unit.columns])

# write to s3
defective_unit_join.write.mode("overwrite").format("parquet").save(
    "s3://iprocess-qa-glue/glue/defective/"
)
actualcount_unit_defective_join.write.mode("overwrite").format("parquet").save(
    "s3://iprocess-qa-glue/glue/actualcount/"
)
disruption_unit_team_originator_part_cyclestation_join.write.mode("overwrite").format("parquet").save(
    "s3://iprocess-qa-glue/glue/disruption/"
)
oee_unit_join.write.mode("overwrite").format("parquet").save("s3://iprocess-qa-glue/glue/oee/")
unit.write.mode("overwrite").format("parquet").save("s3://iprocess-qa-glue/glue/unit/")

job.commit()
