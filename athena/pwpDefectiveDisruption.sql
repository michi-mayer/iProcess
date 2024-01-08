CREATE OR REPLACE VIEW pwp_defective_disruption_view AS
SELECT datetime,
         pwpdef.unitname,
         pwpdef.partnumber,
         defectivecause,
         count,
         quota,
         actualcount
FROM "disruptions_view"."pwp_athena_defective" pwpdef, "disruptions_view"."pwp_athena_actualcount" pwpact
WHERE pwpdef.datetime
    BETWEEN pwpact.datetimestart
        AND pwpact.datetimeend