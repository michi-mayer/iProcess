/* tslint:disable */
/* eslint-disable */

import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";


const lambdaEvent = {'Records': [{'kinesis': {'kinesisSchemaVersion': '1.0', 'partitionKey': 'samplepartitionkey', 'sequenceNumber': '49636908972191369374076735078757409322797149594845184034', 'data': 'ewogICJpZCI6ICIxMjMyIiwKICAiY3JlYXRlZEF0IjogIjIwMjItMDktMjBUMDM6MDI6MzAuMjQyWiIsCiAgInBhcnRJZCI6ICI2MmJkMzcxMS01MzgzLTQyNWUtOGEyYy1kZGQyZDcyN2I5NGEiLAogICJxdW90YSI6ICI4MCIsCiAgImFjdHVhbGNvdW50IjogIjgwIiwKICAic2hpZnQiOiAibmlnaHRTaGlmdCIsCiAgInRpbWVab25lIjogIkV1cm9wZS9CZXJsaW4iLAogICJ0eXBlIjogIlByb2R1Y3Rpb24iLAogICJ1bml0SWQiOiAiN2NkMGM0MDgtZTYxOS00MWVlLTEyMzQtNTQzMTdhYWY0MTFlIgp9', 'approximateArrivalTimestamp': 1_673_356_514.393}, 'eventSource': 'aws:kinesis', 'eventVersion': '1.0', 'eventID': 'shardId-000000000002:49636908972191369374076735078757409322797149594845184034', 'eventName': 'aws:kinesis:record', 'invokeIdentityArn': 'arn:aws:iam::465477822022:role/service-role/actualcount-kinesis-consumer-role-8vp7yoh2', 'awsRegion': 'eu-west-1', 'eventSourceARN': 'arn:aws:kinesis:eu-west-1:465477822022:stream/actualcount'}]} // ES Modules import
// const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import

// const json = JSON.parse(lambdaEvent)

async function putKinesisRecordToDynamoDB(record) {
  const base64 = record.kinesis.data
  const buff = Buffer.from(base64, 'base64');
  const string = buff.toString('utf-8');

  console.log(string)
  const client = new DynamoDBClient(config);
  const command = new UpdateItemCommand(string);
  const response = await client.send(command);
}

lambdaEvent.Records.every((element) => putKinesisRecordToDynamoDB(element))

