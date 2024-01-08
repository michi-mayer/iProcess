from pyspark.sql import functions as F
from pyspark.sql.functions import expr

def join_defective_actualcount(defective, actualcount_unit_join):
    """Function joining defectives to actualcounts per timeslot"""
    # shift end of timeslot second to avoid overlap when joining
    actualcount_unit_join = actualcount_unit_join.withColumn("datetimeendutc", expr("datetimeendutc - interval 1 second")).withColumn("datetimeendutc", F.col("datetimeendutc").cast("timestamp"))
    defective = defective.select(
        [F.col(c).alias("legacy" + c) for c in ("unitid", "partid", "datetimeutc")]
        + ["count"]
    )
    actualcount_unit_join = actualcount_unit_join.drop(".unitid")
    join_condition = (
        (actualcount_unit_join["partid"] == defective["legacypartid"])
        & (actualcount_unit_join["unitid"] == defective["legacyunitid"])
        & (
            defective["legacydatetimeutc"].between(
                actualcount_unit_join["datetimestartutc"],
                actualcount_unit_join["datetimeendutc"],
            )
        )
    )
    actualcount_unit_join = actualcount_unit_join.join(
        defective, join_condition, "left"
    )
    actualcount_unit_join = actualcount_unit_join.drop(
        "legacyunitid", "legacypartid", "legacydatetimeutc"
    )
    # shift end time of timeslot back
    actualcount_unit_join = actualcount_unit_join.withColumn("datetimeendutc", expr("datetimeendutc + interval 1 second"))
    cols = actualcount_unit_join.columns
    cols.remove("count")
    # aggregate counts
    return actualcount_unit_join.groupBy(cols).agg(F.sum("count").alias("count")).withColumn("datetimestartutc", F.col("datetimestartutc").cast("timestamp"))

def overwrite_editable_fields(disruption):
    """ overwrite editable fields in disruptions with fields in linked template """
    editable_fields = ('description', 'dislocation', 'dislocationtype', 'dislocationspecification')
    editable_fields_template_id = ('id', 'templateid') + editable_fields
    disruption_to_join = disruption.select([F.col(c).alias("legacy" + c) for c in editable_fields_template_id])
    disruption = disruption.join(disruption_to_join, disruption['templateid'] == disruption_to_join['legacyid'], "left")
    for field in editable_fields:
        legacy_field = 'legacy' + field
        # overwrite field if disruption is neither a template nor a genericDisruption and there was a template found
        disruption = disruption.withColumn(field, F.when((F.col('template') == 'no') & (F.col('templateid') != 'genericDisruption') & (F.col('legacytemplateid').isNotNull()), F.col(legacy_field)).otherwise(F.col(field)))
        disruption = disruption.drop(legacy_field)
    disruption = disruption.drop('legacyid', 'legacytemplateid')
    return disruption

def join_list_or_none_to_str(lis):
    """Function joining the first element of a list of lists with a semicolon"""
    if not lis or len(lis) == 0:
        return ""
    return (";").join([x[0] for x in lis])


