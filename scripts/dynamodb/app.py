"""
CLI tool
"""
# Futures
from __future__ import annotations

# STD
import os
import json
from argparse import ArgumentParser, RawTextHelpFormatter
from typing import Optional, List
from decimal import Decimal
from pathlib import Path

# Local
from client import DEFAULT_REGION, Environment
from core import FILTER_DOCS_LINK, AppState, run, get_credentials, csv_to_items


def _get_filter(path: str) -> dict:
    if path and len(path.strip()) > 0:
        return json.loads(path, parse_float=Decimal)
    return {}


def parse(args: Optional[List[str]] = None) -> AppState:
    parser = ArgumentParser(
        formatter_class=RawTextHelpFormatter,
        description=''.join([
            'Perform reads and writes to DynamoDB using CSVs, locally. ',
            'Please, select one of the following profiles to continue: ',
            os.linesep,
            os.linesep.join(get_credentials())
        ]))

    read_write_mode_message = "Options '-r' and '-w' cannot be used at the same time"

    parser.add_argument('-p', '--production', action='store_true',
                        help="If not passed, the script will run but it won't read from or write to the database")
    parser.add_argument('-w', '--only-write-from', action='store', type=Path,
                        help=f'Path to the CSV file to read from. If passed, it will only write to the output database. {read_write_mode_message}')
    parser.add_argument('-r', '--only-read', action='store_true',
                        help=f'If passed, it will only read from the input database. {read_write_mode_message}')
    parser.add_argument('-f', '--input-filter', action='store', type=Path,
                        help=f'Path to a JSON file with the filter to use to read. Please see {FILTER_DOCS_LINK}')
    parser.add_argument('--input-table-name',
                        help="The table's name to read from")
    parser.add_argument('--output-table-name',
                        help="The table's name to write to")
    parser.add_argument('--input-profile',
                        help='The profile used to connect to the database from which to read from')
    parser.add_argument('--output-profile',
                        help='The profile used to connect to the database from which to write to')
    parser.add_argument('--input-region', default=DEFAULT_REGION,
                        help='The region used to connect to the database from which to read from')
    parser.add_argument('--output-region', default=DEFAULT_REGION,
                        help='The region used to connect to the database from which to write to')

    args = parser.parse_args(args)

    dry_run = not args.production
    input_filter = _get_filter(args.input_filter)

    if args.only_read:
        # ? Use case 1: read from a table & keep the data locally
        input_data = None
        input_environment = Environment(args.input_profile, args.input_region, args.input_table_name)
        output_environment = None
    elif args.only_write_from:
        # ? Use case 2: read from a local CSV file & write to a table
        input_data = csv_to_items(args.only_write_from)
        input_environment = None
        output_environment = Environment(args.output_profile, args.output_region, args.output_table_name)
    else:
        # ? Use case 3: read from a table & write to another table
        input_data = None
        input_environment = Environment(args.input_profile, args.input_region, args.input_table_name)
        output_environment = Environment(args.output_profile, args.output_region, args.output_table_name)

    return AppState(input_filter, input_data, input_environment, output_environment, None, dry_run)


def main(args: Optional[List[str]] = None):
    print('Welcome to the DynamoDB read & write assistant 🤖')
    state = parse(args)
    run(state)
    print('Bye bye! Have a great day 🥹')


if __name__ == "__main__":
    main()
    # try:
    # except Exception as error:
    # sys.exit(error)
