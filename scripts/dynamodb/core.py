"""
Functionality shared between the CLI app and the UI app

Filter docs:
https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.scan
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.FilterExpression
"""
# modules in STD
import os
import re
import string
import logging as log
from os.path import expanduser
from pathlib import Path
from datetime import datetime
from typing import Literal, Optional, List, Union
from dataclasses import dataclass, field

# 3rd party
import pandas as pd
from pandas import DataFrame

# Local
from utils import Singleton
from client import DynamoDBClient, Environment

DATETIME_FORMAT = '%d-%m-%YT%H.%M.%SZ'
ONLY_NUMBERS = tuple(string.digits)
FILTER_DOCS_LINK = 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.FilterExpression'

SheetFormat = Union[Literal['csv'], Literal['excel']]

@dataclass
class AppState(metaclass=Singleton):
    input_filter: dict = field(default_factory=dict)
    input_data: Optional[DataFrame] = None
    input_environment: Optional[Environment] = None
    output_environment: Optional[Environment] = None
    saved_filename: Optional[str] = None
    dry_run: bool = False


def run(state: AppState):
    db_client: DynamoDBClient
    log.info(state)

    if state.input_data is not None and state.input_environment is not None:
        raise Exception("'--only-write-from' and '--only-read' cannot be used at the same time")
    elif state.input_data is not None and state.output_environment is not None:
        # ? Use case 1: read from a local CSV file & write to a table
        print('Mode: Only write')
        db_client = DynamoDBClient(state.output_environment)
        data_from_file = state.input_data.to_dict(orient='records')
        db_client.write(state.output_environment.table_name, data_from_file, state.dry_run)

        print(f'Wrote {len(state.input_data)} items to table {state.output_environment.table_name}')
        return None
    elif state.input_environment is not None and state.output_environment is not None:
        # ? Use case 2: read from a table & write to another table
        print('Mode: Read & write')
        db_client = DynamoDBClient(state.input_environment)
        data_from_db = db_client.read(state.input_environment.table_name, state.input_filter, state.dry_run)
        saved_filename = save(state.input_environment.table_name, data_from_db)

        db_client = DynamoDBClient(state.output_environment)
        db_client.write(state.output_environment.table_name, data_from_db, state.dry_run)

        print(f'Wrote {len(data_from_db)} items to table {state.output_environment.table_name}')
        return saved_filename
    elif state.input_environment is not None:
        # ? Use case 3: read from a table & keep the data locally
        print('Mode: Only read')
        db_client = DynamoDBClient(state.input_environment)
        data_from_db = db_client.read(state.input_environment.table_name, state.input_filter, state.dry_run)

        print(f'Read {len(data_from_db)} items from table {state.input_environment.table_name}')
        return save(state.input_environment.table_name, data_from_db)
    else:
        raise Exception('Cannot run any use case')


def get_credentials() -> List[str]:
    """Gets AWS credential names (this is, it doesn't display private IDs and secrets)"""
    profiles = os.popen("cat ~/.aws/credentials | grep -E '\[.+\]'").read().split(os.linesep)
    profiles = [re.sub('[\[\]]', '', _) for _ in profiles]
    return [_ for _ in profiles if _.startswith(ONLY_NUMBERS)]


def save(table_name: str, data: List[dict], file_format: SheetFormat = 'excel') -> str:
    now = datetime.now().strftime(DATETIME_FORMAT)
    return items_to_csv(data, f"~/Downloads/{table_name}-{now}", file_format)


def items_to_csv(items: List[dict], filename: str, file_format: SheetFormat, column_separator: str = ',') -> str:
    absolute_path = Path(expanduser(filename)).absolute()
    dataframe =  pd.DataFrame.from_records(items)

    if file_format == "csv":
        dataframe.to_csv(f"{absolute_path}.csv", sep=column_separator, index=False)
    else:
        dataframe.to_excel(f"{absolute_path}.xlsx", index=False)        
    print(f"There's a {file_format} with data available at {absolute_path}")
    return absolute_path


def read_sheet(filename: str) -> pd.DataFrame:
    if ".csv" in filename:
        return pd.read_csv(filename, sep=',', na_filter=False)
    else:
        return pd.read_excel(filename, na_filter=False)


def csv_to_items(filename: str) -> List[dict]:
    return read_sheet(filename).to_dict(orient="records")
