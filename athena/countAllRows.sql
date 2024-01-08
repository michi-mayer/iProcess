SELECT 
    (SELECT COUNT(*)
    FROM "disruptions_view"."pwk_athena_disruption" ) AS pwk_disruption, 
    (SELECT COUNT(*)
    FROM "disruptions_view"."pwp_athena_disruption" ) AS pwp_disruption,
    (SELECT COUNT(*)
    FROM "disruptions_view"."pwk_athena_actualcount" ) AS pwk_actualcount, 
    (SELECT COUNT(*)
    FROM "disruptions_view"."pwp_athena_actualcount" ) AS pwp_actualcount, 
    (SELECT COUNT(*)
    FROM "disruptions_view"."pwk_athena_defective" ) AS pwk_defective, 
    (SELECT COUNT(*)
    FROM "disruptions_view"."pwp_athena_defective" ) AS pwp_defective