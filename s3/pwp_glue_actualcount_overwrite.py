import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

# @params: [JOB_NAME]
args = getResolvedOptions(sys.argv, ['JOB_NAME'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)
# @type: DataSource
# @args: [database = "disruptions_view", table_name = "pwp_crawled_actualcount_ky4eu5sohvexzdke2rkbshipwm_masterpwp", transformation_ctx = "DataSource0"]
# @return: DataSource0
# @inputs: []
DataSource0 = glueContext.create_dynamic_frame.from_catalog(
    database="disruptions_view", table_name="pwp_crawled_actualcount_ky4eu5sohvexzdke2rkbshipwm_masterpwp", transformation_ctx="DataSource0")
# @type: DropFields
# @args: [paths = [], transformation_ctx = "Transform0"]
# @return: Transform0
# @inputs: [frame = DataSource0]
Transform0 = DropFields.apply(frame=DataSource0, paths=[
                              "__typename"], transformation_ctx="Transform0")
df = Transform0.toDF()
df.write.mode('overwrite').json(
    's3://s3-vw-poc-quicksight/pwp_glued_actualcount/')
job.commit()
