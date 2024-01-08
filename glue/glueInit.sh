#!/bin/bash

# Schedules can be edited here: https://eu-central-1.console.aws.amazon.com/glue/home?region=eu-central-1#etl:tab=triggers

echo -n "Please enter a job name: "
read jobname

echo "Syncing files"
aws s3 sync ../s3 s3://aws-glue-assets-792943650420-eu-central-1/scripts/

if [ $jobname = "all" ]
  then
  array=( pwk_glue_disruption_overwrite pwk_glue_defective_overwrite pwk_glue_actualcount_overwrite pwp_glue_disruption_overwrite pwp_glue_defective_overwrite pwp_glue_actualcount_overwrite)

  for jobname in "${array[@]}"
  do
    echo "Deleting job ${jobname}"
    aws glue delete-job --job-name $jobname 
    echo "Adding job ${jobname}"
    aws glue create-job --timeout 30 --max-retries 1 --glue-version 2.0 --number-of-workers 10 --worker-type G.1X --name $jobname --role AWSGlueServiceRole-crwler --command "Name=glueetl,ScriptLocation=s3://aws-glue-assets-792943650420-eu-central-1/scripts/${jobname}.py"
  done
  exit
fi

echo "Deleting job ${jobname}"
aws glue delete-job --job-name $jobname 
echo "Adding job ${jobname}"
aws glue create-job --timeout 30 --max-retries 1 --glue-version 2.0 --number-of-workers 10 --worker-type G.1X --name $jobname --role AWSGlueServiceRole-crwler --command "Name=glueetl,ScriptLocation=s3://aws-glue-assets-792943650420-eu-central-1/scripts/${jobname}.py"