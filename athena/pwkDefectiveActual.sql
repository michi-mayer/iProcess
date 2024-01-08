CREATE OR REPLACE VIEW pwk_defective_actualcount_view AS 
SELECT
  datetime
, pwkdef.unitname
, pwkdef.partnumber
, defectivecause
, count
, quota
, actualcount
, pwkdef.shift
FROM
  disruptions_view.pwk_athena_defective pwkdef
, disruptions_view.pwk_athena_actualcount pwkact
WHERE (pwkdef.datetime BETWEEN pwkact.datetimestart AND pwkact.datetimeend)
