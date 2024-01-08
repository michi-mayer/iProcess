CREATE OR REPLACE VIEW pwk_defective_disruption_view AS
SELECT datetime,
         defectivecause,
         count,
         measures,
         description
FROM "disruptions_view"."pwk_athena_defective" pwkdef, "disruptions_view"."pwk_athena_disruption" pwkdis
WHERE pwkdef.partid = pwkdis.partid ;