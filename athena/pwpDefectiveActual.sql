CREATE OR REPLACE VIEW pwp_defective_actualcount_view AS 
SELECT
  datetime
, pwpdef.unitname
, pwpdef.partnumber
, defectivecause
, count
, quota
, actualcount
, pwpdef.shift
FROM
  disruptions_view.pwk_athena_defective pwpdef
, disruptions_view.pwk_athena_actualcount pwpact
WHERE (pwpdef.datetime BETWEEN pwpact.datetimestart AND pwpact.datetimeend)
