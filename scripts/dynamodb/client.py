"""
Following the guidelines from (but not derived from)

https://docs.aws.amazon.com/solutions/latest/media-services-application-mapper/dynamodb-table-migration-tool.html
https://github.com/aws-solutions/aws-media-services-application-mapper/blob/main/source/tools/copy_table.py
"""

# STD
import os
import json
import numpy as np
import logging as log
from typing import Any, Optional, List
from dataclasses import dataclass, astuple
from decimal import Decimal

# Installed
from tqdm import tqdm
from boto3.session import Session
from boto3.resources.base import ServiceResource
from boto3.dynamodb.types import TypeDeserializer
from botocore.client import BaseClient

# Local
from utils import DecimalEncoder, record_time


FIXED_BATCH_SIZE = 100
DEFAULT_NUMBER_OF_BATCHES = 1

@dataclass
class Environment:
    aws_profile: str
    aws_region: str
    table_name: str

    def __iter__(self):
        """Used for unpacking/destructuring an instance"""
        return iter(astuple(self))


@dataclass
class DynamoDBClient:
    """
    AWS SDK only include type definitions for generic clients, but that should suffice

    Client documentation (used for 'read'):
        https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client

    Service documentation (used for 'write'):
        https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table

    Services offer a high-level API whereas Clients offer a low-level API. However, the 'FilterExpression' syntax in
    the client is the same as it is in TypeScript, thus its usage. Both APIs have lazy evaluation.
    """
    client: BaseClient
    connector: ServiceResource

    def __init__(self, environment: Environment) -> None:
        _set_environment(environment)

        session = Session(profile_name=environment.aws_profile, region_name=environment.aws_region)
        self.client = session.client('dynamodb')
        self.connector = session.resource('dynamodb')

    def read(self, table_name: str, filter_expr: dict = {}, dry_run: bool = False) -> List[dict]:
        all_items_read, all_items, last_key, times = False, [], None, 1

        print('Usage of "filter_expression" is disabled')

        if dry_run:
            log.info('Dry run is set to true')
            log.info(f'Would have filtered table {table_name} with {filter_expr}')
        else:
            while not all_items_read:
                parameters = {}

                if last_key:
                    parameters['ExclusiveStartKey'] = last_key

                with record_time(f"scanning table {table_name} ({times} reads needed)"):
                    response = self.client.scan(TableName=table_name, **parameters)
                    last_key = response.get("LastEvaluatedKey")

                    all_items.extend([_deserialize(item) for item in response["Items"]])
                    times += 1

                    if not last_key:
                        all_items_read = True

        print(f'Read {len(all_items)} items')
        return all_items

    def write(self, table_name: str, elements: List[dict], dry_run: bool = False) -> int:
        """Returns the number of items written"""
        table = self.get_table(table_name)
        data_size = len(elements)

        if dry_run:
            log.info('Dry run is set to true')
            log.info(f'{data_size} items would have beeen written to table {table_name}')
        else:
            number_of_batches = data_size // FIXED_BATCH_SIZE or DEFAULT_NUMBER_OF_BATCHES
            batches = np.array_split(elements, number_of_batches)
            log.info(f'Writing {data_size} items in {number_of_batches} batches of size {FIXED_BATCH_SIZE}')

            with record_time(f"writing to table {table_name}"):
                for batch in tqdm(batches):
                    with table.batch_writer() as writer:
                        for raw_item in batch:
                            item = self.prepare(raw_item)
                            writer.put_item(Item=item)

        return len(elements)

    @staticmethod
    def prepare(raw_item: dict, default_value: Optional[str] = None) -> dict:
        item = json.loads(json.dumps(raw_item, cls=DecimalEncoder), parse_float=Decimal)
        return {key: value for key, value in item.items() if not _falsy(value)}

    def get_table(self, table_name: str) -> object:
        table = self.connector.Table(table_name)

        _ = table.creation_date_time  # ? Used to check if the connection is right ('.Table' method is lazy)
        log.info(f'Successfully connected to table {table_name}')

        return table


_deserializer = TypeDeserializer()


def _falsy(value: Any) -> bool:
    if isinstance(value, str):
        return len(value.strip()) == 0
    else:
        return bool(value)
        

def _deserialize(item: dict) -> dict:
    return {key: _deserializer.deserialize(value) for key, value in item.items()}


def _get_available_regions() -> List[str]:
    all_regions = Session().get_available_regions('dynamodb')
    return ['eu-west-1', *[_ for _ in all_regions if _ != 'eu-west-1']]


def _set_environment(environment: Environment):
    os.environ['AWS_PROFILE'] = environment.aws_profile
    os.environ['AWS_REGION'] = environment.aws_region
    [os.environ.pop(key, None) for key in ('AWS_SESSION_TOKEN', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY')]


ALL_REGIONS = _get_available_regions()
DEFAULT_REGION = 'eu-west-1'
DEFAULT_TABLE_NAME = 'Unit-2bhuxjwdvjh5ddqyyzpfmuusii-develop'
