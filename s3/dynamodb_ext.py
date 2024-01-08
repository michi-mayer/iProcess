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
## @args: [database = "nw_pwk", table_name = "_outpwkdisruption_675orbcw3bg5xovk7fvhcdicja_masterpwk", transformation_ctx = "DataSource0"]
## @return: DataSource0
## @inputs: []
DataSource0 = glueContext.create_dynamic_frame.from_catalog(database = "nw_pwk", table_name = "_outpwkdisruption_675orbcw3bg5xovk7fvhcdicja_masterpwk", transformation_ctx = "DataSource0")
## @type: DataSink
## @args: [connection_type = "s3", catalog_database_name = "nw_pwk", format = "csv", connection_options = {"path": "s3://s3-quicksight-mockdata/", "partitionKeys": [], "enableUpdateCatalog":true, "updateBehavior":"UPDATE_IN_DATABASE"}, catalog_table_name = "newpwk_catalog", transformation_ctx = "DataSink0"]
## @return: DataSink0
## @inputs: [frame = DataSource0]
DataSink0 = glueContext.getSink(path = "s3://s3-quicksight-mockdata/", connection_type = "s3", updateBehavior = "UPDATE_IN_DATABASE", partitionKeys = [], enableUpdateCatalog = True, transformation_ctx = "DataSink0")
DataSink0.setCatalogInfo(catalogDatabase = "nw_pwk",catalogTableName = "newpwk_catalog")
DataSink0.setFormat("csv")
DataSink0.writeFrame(DataSource0)

job.commit()