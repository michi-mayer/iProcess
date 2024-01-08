# DynamoDB download & upload tool

This tool allows to download and upload data to multiple DynamoDB instances. There are 3 use cases:

1. Read from a table in one database, and write to another table in another database
   1. You can also read and write in the same database
2. Only read from a table in a database
3. Only write to a table in a database database; it requires a CSV file to read from

> It's not possible to only read and only write at the same time

Moreover, for each of these cases, you can do a _dry run_, which will check if everything in the configuration is OK,
but won't read or write to the database.

## Common pre-requisites

There is a `yarn prepare:python` command available that will do the following:

1. Check if you've Python installed, with at least version 3.8
   1. If you don't meet this requirement, check the [following section](#install-python)
2. Create a virtual environment - this way, it will only install the required libraries for the project

Moreover, you need a tool that sets up AWS Profiles in your PC, such as the [lz_cli](https://devstack.vwgroup.com/confluence/pages/viewpage.action?pageId=331792128&preview=%2F331792128%2F638439714%2Flz_cli_mac_2.0.1.zip) from Volkswagen confluence. You must also be logged in already, in any environment you want to access to.

For example, if I want to move data from the DEV to the INT environment, I must have logged in to both environments
with the `lz_cli` tool.

### Install Python

It's recommended to install Python with a version manager like [pyenv][pyenv-info]:

1. If you're running on MacOS, it's easier if you install it [with brew][brew]: `brew install pyenv`
2. Otherwise, go to the console and run [`curl https://pyenv.run | bash`][pyenv]
3. Finally, open a new Terminal and and run `pyenv install 3.8.14`; then `pyenv versions` to list the installed versions, and `pyenv global 3.8.14` to set the Python version to 3.8

Check again with `yarn prepare:python`.

## Use the tool

### Browser UI

There's a web browser UI available, which you can use by running `yarn dynamodb`.

### CLI script

To run the CLI script, _cd_ into this directory and run `python app.py --help`

#### Sample run

With the following run, it would read all Measure Reports from develop, keep it in a CSV file, and then write it to a new table in develop as well.

> The table would have been already created via AWS UI or AWS CLI

```sh
python app.py -p \
  --input-table-name MeasureReport-2bhuxjwdvjh5ddqyyzpfmuusii-develop \
  --input-profile 465477822022_PA_DEVELOPER \
  --input-region eu-west-1 \
  --output-table-name realdummytable \
  --output-profile 465477822022_PA_DEVELOPER \
  --output-region eu-west-1
```

## Maintenance

The UI app is written in `app.ipynb`. It uses Jupyter Notebooks so you can develop and test quickly, and the UI is rendered by [Voilà][voila].

The CLI app is written in `app.py`. It uses the argument parser from the standard library.

To make the app's interface reusable (so that we can easily do a CLI interface and an UI interface), the rest of the code is structured the following way:

- DynamoDB client is in `client.py`
- Logic is in `core.py`
- Other utilities (not tied to the DynamoDB logic) are in `utils.py`

### IDE

This tool has been developed with VS Code with the [Python bundle][code].

### Formatting

Make sure to use `autopep8` with the following configuration: `--max-line-length 120`.

[brew]: https://formulae.brew.sh/formula/pyenv#default
[pyenv]: https://github.com/pyenv/pyenv-installer#install
[pyenv-info]: https://github.com/pyenv/pyenv
[voila]: https://github.com/voila-dashboards/voila
[code]: https://marketplace.visualstudio.com/items?itemName=ms-python.python
