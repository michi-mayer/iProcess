# Data Integrity

## Recreating database state

### Using scripts

The scripts are available in the form of a Jupyter Notebook in `scripts/notebooks`.

### Using DynamoDB backups

You can back up a table and then restore it with a different name. If you want to use the backup in a different account, then the easiest way to do it is:

1. Restore the backup in a table,
2. Download it as a CSV using the scripts shown before
3. Upload the CSV to the new table in the other account using the scripts shown before

