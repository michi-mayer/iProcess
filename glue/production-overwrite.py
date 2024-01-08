import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.gluetypes import *
from awsglue import DynamicFrame

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Script generated for node OEE DynamoDB
OEEDynamoDB_node1657012764145 = glueContext.create_dynamic_frame.from_catalog(
    database="production",
    table_name="crawled_oee_2wc63se2djd23jcqymxf2gn4pe_prod",
    transformation_ctx="OEEDynamoDB_node1657012764145",
)

# Script generated for node Defective DynamoDB
DefectiveDynamoDB_node1 = glueContext.create_dynamic_frame.from_catalog(
    database="production",
    table_name="crawled_defective_2wc63se2djd23jcqymxf2gn4pe_prod",
    transformation_ctx="DefectiveDynamoDB_node1",
)

# Script generated for node Part DynamoDB
PartDynamoDB_node1 = glueContext.create_dynamic_frame.from_catalog(
    database="production",
    table_name="crawled_part_2wc63se2djd23jcqymxf2gn4pe_prod",
    transformation_ctx="PartDynamoDB_node1",
)

# Script generated for node Disruption DynamoDB
DisruptionDynamoDB_node1657013104017 = glueContext.create_dynamic_frame.from_catalog(
    database="production",
    table_name="crawled_disruption_2wc63se2djd23jcqymxf2gn4pe_prod",
    transformation_ctx="DisruptionDynamoDB_node1657013104017",
)

# Script generated for node Unit DynamoDB
UnitDynamoDB_node1657012686345 = glueContext.create_dynamic_frame.from_catalog(
    database="production",
    table_name="crawled_unit_2wc63se2djd23jcqymxf2gn4pe_prod",
    transformation_ctx="UnitDynamoDB_node1657012686345",
)

# Script generated for node ActualCount DynamoDB
ActualCountDynamoDB_node1657012408389 = glueContext.create_dynamic_frame.from_catalog(
    database="production",
    table_name="crawled_actualcount_2wc63se2djd23jcqymxf2gn4pe_prod",
    transformation_ctx="ActualCountDynamoDB_node1657012408389",
)

# Script generated for node OEE Mapping
OEEMapping_node1657012787853 = ApplyMapping.apply(
    frame=OEEDynamoDB_node1657012764145,
    mappings=[
        ("shifttype", "string", "shifttype", "string"),
        ("unitname", "string", "unitname", "string"),
        ("timezone", "string", "timezone", "string"),
        ("availability", "double", "availability", "double"),
        ("quality", "double", "quality", "double"),
        ("starttimedateutc", "string", "starttimedateutc", "timestamp"),
        ("createdat", "string", "createdat", "timestamp"),
        ("performance", "double", "performance", "double"),
        ("unitid", "string", "unitid", "string"),
        ("overall", "double", "overall", "double"),
        ("id", "string", "id", "string"),
        ("endtimedateutc", "string", "endtimedateutc", "timestamp"),
        ("updatedat", "string", "updatedat", "timestamp"),
    ],
    transformation_ctx="OEEMapping_node1657012787853",
)

# Script generated for node Defective Mapping
DefectiveMapping_node2 = ApplyMapping.apply(
    frame=DefectiveDynamoDB_node1,
    mappings=[
        ("datetimeutc", "string", "datetimeutc", "timestamp"),
        ("unitname", "string", "unitname", "string"),
        ("partid", "string", "partid", "string"),
        ("shift", "string", "shift", "string"),
        ("count", "long", "count", "int"),
        ("timezone", "string", "timezone", "string"),
        ("partname", "string", "partname", "string"),
        ("createdat", "string", "createdat", "timestamp"),
        ("deleted", "string", "deleted", "boolean"),
        ("unitid", "string", "unitid", "string"),
        ("partnumber", "string", "partnumber", "string"),
        ("id", "string", "id", "string"),
        ("updatedat", "string", "updatedat", "timestamp"),
        ("defectiveCause", "string", "defectiveCause", "string"),
        ("defectiveGrid", "string", "defectiveGrid", "string"),
        ("defectiveLocation", "string", "defectiveLocation", "string"),
    ],
    transformation_ctx="DefectiveMapping_node2",
)

# Script generated for node Change Schema (Apply Mapping)
PartMapping_node2 = ApplyMapping.apply(
    frame=PartDynamoDB_node1,
    mappings=[
        ("name", "string", "name", "string"),
        ("partnumber", "string", "partnumber", "string"),
        ("id", "string", "partId", "string"),
    ],
    transformation_ctx="PartMapping_node2",
)

# Script generated for node Disruption Mapping
DisruptionMapping_node1657013141968 = ApplyMapping.apply(
    frame=DisruptionDynamoDB_node1657013104017,
    mappings=[
        ("template", "string", "template", "string"),
        ("partid", "string", "partid", "string"),
        ("dislocationtype", "string", "dislocationtype", "string"),
        ("timezone", "string", "timezone", "string"),
        ("description", "string", "description", "string"),
        ("dislocationspecification", "string", "dislocationspecification", "string"),
        ("starttimedateutc", "string", "starttimedateutc", "timestamp"),
        ("duration", "string", "duration", "string"),
        ("createdat", "string", "createdat", "timestamp"),
        ("measures", "string", "measures", "string"),
        ("deleted", "string", "deleted", "boolean"),
        ("unitid", "string", "unitid", "string"),
        ("id", "string", "id", "string"),
        ("endtimedateutc", "string", "endtimedateutc", "timestamp"),
        ("dislocation", "string", "dislocation", "string"),
        ("updatedat", "string", "updatedat", "timestamp"),
        ("templateId", "string", "templateId", "string"),
        ("segmentId", "string", "segmentId", "string"),
        ("shiftType", "string", "shiftType", "string"),
    ],
    transformation_ctx="DisruptionMapping_node1657013141968",
)

# Script generated for node Unit Mapping
UnitMapping_node1657012703487 = ApplyMapping.apply(
    frame=UnitDynamoDB_node1657012686345,
    mappings=[
        ("name", "string", "unitname", "string"),
        ("id", "string", "unitid", "string"),
    ],
    transformation_ctx="UnitMapping_node1657012703487",
)

# Script generated for node ActualCount Mapping
ActualCountMapping_node1657012482405 = ApplyMapping.apply(
    frame=ActualCountDynamoDB_node1657012408389,
    mappings=[
        ("unitname", "string", "unitname", "string"),
        ("partid", "string", "partid", "string"),
        ("shift", "string", "shift", "string"),
        ("timezone", "string", "timezone", "string"),
        ("type", "string", "type", "string"),
        ("partname", "string", "partname", "string"),
        ("createdat", "string", "createdat", "timestamp"),
        ("quota", "long", "quota", "int"),
        ("unitid", "string", "unitid", "string"),
        ("datetimeendutc", "string", "datetimeendutc", "timestamp"),
        ("partnumber", "string", "partnumber", "string"),
        ("configurationid", "string", "configurationid", "string"),
        ("id", "string", "id", "string"),
        ("shiftmodelid", "string", "shiftmodelid", "string"),
        ("datetimestartutc", "string", "datetimestartutc", "timestamp"),
        ("updatedat", "string", "updatedat", "timestamp"),
        ("actualcount", "long", "actualcount", "int"),
    ],
    transformation_ctx="ActualCountMapping_node1657012482405",
)

# Script generated for node Unit OEE Join
UnitOEEJoin_node1657012803879 = Join.apply(
    frame1=UnitMapping_node1657012703487,
    frame2=OEEMapping_node1657012787853,
    keys1=["unitid"],
    keys2=["unitid"],
    transformation_ctx="UnitOEEJoin_node1657012803879",
)

# Script generated for node Unit Disruption Join
UnitDisruptionJoin_node1657013155167 = Join.apply(
    frame1=DisruptionMapping_node1657013141968,
    frame2=UnitMapping_node1657012703487,
    keys1=["unitid"],
    keys2=["unitid"],
    transformation_ctx="UnitDisruptionJoin_node1657013155167",
)

# Script generated for node Drop .unitid OEE
DropunitidOEE_node1657012991310 = DropFields.apply(
    frame=UnitOEEJoin_node1657012803879,
    paths=["`.unitid`"],
    transformation_ctx="DropunitidOEE_node1657012991310",
)

# Script generated for node Join
PartDisruptionJoin_node1657013155167 = Join.apply(
    frame1=PartMapping_node2,
    frame2=UnitDisruptionJoin_node1657013155167,
    keys1=["partId"],
    keys2=["partid"],
    transformation_ctx="PartDisruptionJoin_node1657013155167",
)

# Script generated for node Mapping Disruption with Part and Unit
MappingDisruptionwithPartandUnit_node1669124866116 = ApplyMapping.apply(
    frame=PartDisruptionJoin_node1657013155167,
    mappings=[
        ("name", "string", "partname", "string"),
        ("partnumber", "string", "partnumber", "string"),
        ("partId", "string", "partId", "string"),
        ("template", "string", "template", "string"),
        ("dislocationtype", "string", "dislocationtype", "string"),
        ("timezone", "string", "timezone", "string"),
        ("description", "string", "description", "string"),
        ("dislocationspecification", "string", "dislocationspecification", "string"),
        ("templateid", "string", "templateid", "string"),
        ("starttimedateutc", "timestamp", "starttimedateutc", "timestamp"),
        ("duration", "string", "duration", "string"),
        ("createdat", "string", "createdat", "string"),
        ("measures", "string", "measures", "string"),
        ("deleted", "boolean", "deleted", "boolean"),
        ("segmentid", "string", "segmentid", "string"),
        ("unitid", "string", "unitid", "string"),
        ("id", "string", "id", "string"),
        ("endtimedateutc", "timestamp", "endtimedateutc", "timestamp"),
        ("dislocation", "string", "dislocation", "string"),
        ("updatedat", "timestamp", "updatedat", "timestamp"),
        ("unitname", "string", "unitname", "string"),
        ("index", "long", "index", "long"),
        ("isactive", "string", "isactive", "string"),
        ("shiftType", "string", "shiftType", "string"),
    ],
    transformation_ctx="MappingDisruptionwithPartandUnit_node1669124866116",
)

# Script generated for node Defective S3
# DefectiveS3_node3 = glueContext.write_dynamic_frame.from_options(
#     frame=DefectiveMapping_node2,
#     connection_type="s3",
#     format="glueparquet",
#     connection_options={"path": "s3://devglue/glue/defective/", "partitionKeys": []},
#     format_options={"compression": "snappy"},
#     transformation_ctx="DefectiveS3_node3",
# )

# Script generated for node ActualCount S3
# ActualCountS3_node1657012547916 = glueContext.write_dynamic_frame.from_options(
#     frame=ActualCountMapping_node1657012482405,
#     connection_type="s3",
#     format="glueparquet",
#     connection_options={"path": "s3://devglue/glue/actualcount/", "partitionKeys": []},
#     format_options={"compression": "snappy"},
#     transformation_ctx="ActualCountS3_node1657012547916",
# )

# Script generated for node Disruption S3
# DisruptionS3_node1657013211494 = glueContext.write_dynamic_frame.from_options(
#     frame=UnitDisruptionJoin_node1657013155167,
#     connection_type="s3",
#     format="glueparquet",
#     connection_options={"path": "s3://devglue/glue/disruption/", "partitionKeys": []},
#     format_options={"compression": "snappy"},
#     transformation_ctx="DisruptionS3_node1657013211494",
# )

# Script generated for node OEE S3
# OEES3_node1657013016396 = glueContext.write_dynamic_frame.from_options(
#     frame=DropunitidOEE_node1657012991310,
#     connection_type="s3",
#     format="glueparquet",
#     connection_options={"path": "s3://devglue/glue/oee/", "partitionKeys": []},
#     format_options={"compression": "snappy"},
#     transformation_ctx="OEES3_node1657013016396",
# )

DefectiveMapping_node2.toDF().write.mode("overwrite").format("parquet").save(
    "s3://iprocess-integration-glue/glue/defective/"
)
ActualCountMapping_node1657012482405.toDF().write.mode("overwrite").format(
    "parquet"
).save("s3://iprocess-integration-glue/glue/actualcount/")
MappingDisruptionwithPartandUnit_node1669124866116.toDF().write.mode(
    "overwrite"
).format("parquet").save("s3://iprocess-integration-glue/glue/disruption/")
try:
    DropunitidOEE_node1657012991310.toDF().write.mode("overwrite").format(
        "parquet"
    ).save("s3://iprocess-integration-glue/glue/oee/")
except Exception:
    print("An exception occurred in saving OEE to S3")


job.commit()
