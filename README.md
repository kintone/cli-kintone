# cli-kintone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A CLI tool to import/export records to/from [kintone](https://www.kintone.com/).

---

- [Installation](#installation)
- [Usage](#usage)
  - [import](#import)
    - [Options](#options)
  - [export](#export)
    - [Options](#options-1)
- [Supported file formats](#supported-file-formats)
  - [CSV format](#csv-format)
- [LICENSE](#license)

## Installation

1. Jump to the [Releases](https://github.com/kintone/cli-kintone/releases) page.
2. Download a ZIP file for your platform from "Assets".
   - Windows: `cli-kintone-win.zip`
   - Linux: `cli-kintone-linux.zip`
   - macOS: `cli-kintone-macos.zip`
3. Extract executables from the ZIP file and run it.

## Usage

### import

The `import` command allows you to import record data into a specified kintone app.

```
$ cli-kintone record import \
--base-url https://${yourDomain} \
--api-token ${apiToken} \
--app ${kintoneAppId} \
--file-path ${filepath}
```

#### Options

Some options use environment variables starting `KINTONE_` as default values.

```
Options:
      --version              Show version number                       [boolean]
      --help                 Show help                                 [boolean]
      --base-url             Kintone Base Url
                                 [string] [required] [default: KINTONE_BASE_URL]
  -u, --username             Kintone Username
                                            [string] [default: KINTONE_USERNAME]
  -p, --password             Kintone Password
                                            [string] [default: KINTONE_PASSWORD]
      --api-token            App's API token[array] [default: KINTONE_API_TOKEN]
      --basic-auth-username  Kintone Basic Auth Username
                                 [string] [default: KINTONE_BASIC_AUTH_USERNAME]
      --basic-auth-password  Kintone Basic Auth Password
                                 [string] [default: KINTONE_BASIC_AUTH_PASSWORD]
      --app                  The ID of the app               [string] [required]
      --guest-space-id       The ID of guest space
                                      [string] [default: KINTONE_GUEST_SPACE_ID]
      --attachments-dir      Attachment file directory                  [string]
      --file-path            The path to source file.
                             The file extension should be ".csv"
                                                             [string] [required]
      --encoding             Character encoding
                                     [choices: "utf8", "sjis"] [default: "utf8"]
      --update-key           The key to Bulk Update                     [string]
      --fields               The fields to be imported in comma-separated
                                                                        [string]
      --pfx-file-path        The path to client certificate file        [string]
      --pfx-file-password    The password of client certificate file    [string]
      --proxy                The URL of a proxy server
                                                 [string] [default: HTTPS_PROXY]
```

#### Import Attachment field

If records contains Attachment field, `--attachments-dir` option is required.

- the local file path in record is treated as relative path from `--attachments-dir`
  - upload the file there
- file name on kintone is same as local

#### Upsert records

When `--update-key` option is set, the option value is used as “Key to Bulk Update” to import (upsert) records.

"Upsert" means updating and/or inserting records at the same time. Data containing keys that match existing record values is used to update those records accordingly, and the remaining data is added to the specified app as new records.

The field specified as "Key to Bulk Update" should meet the following requirements:

- be Record Number field
- be one of the following field types with "Prohibit duplicate values" enabled
  - Text
  - Number

NOTE: When the field specified as "Key to Bulk Update" is Record Number, the value of the field may have app code of the target app.

### export

The `export` command allows you to export record data from a specified kintone app.

```
$ cli-kintone record export \
--base-url https://${yourDomain} \
--api-token ${apiToken} \
--app ${kintoneAppId} \
> ${filepath}
```

#### Options

Some options use environment variables starting `KINTONE_` as default values.

```
Options:
      --version              Show version number                       [boolean]
      --help                 Show help                                 [boolean]
      --base-url             Kintone Base Url
                                 [string] [required] [default: KINTONE_BASE_URL]
  -u, --username             Kintone Username
                                            [string] [default: KINTONE_USERNAME]
  -p, --password             Kintone Password
                                            [string] [default: KINTONE_PASSWORD]
      --api-token            App's API token[array] [default: KINTONE_API_TOKEN]
      --basic-auth-username  Kintone Basic Auth Username
                                 [string] [default: KINTONE_BASIC_AUTH_USERNAME]
      --basic-auth-password  Kintone Basic Auth Password
                                 [string] [default: KINTONE_BASIC_AUTH_PASSWORD]
      --app                  The ID of the app               [string] [required]
      --guest-space-id       The ID of guest space
                                      [string] [default: KINTONE_GUEST_SPACE_ID]
      --attachments-dir      Attachment file directory                  [string]
      --encoding             Character encoding
                                     [choices: "utf8", "sjis"] [default: "utf8"]
  -c, --condition            The query string                           [string]
      --order-by             The sort order as a query                  [string]
      --fields               The fields to be exported in comma-separated
                                                                        [string]
      --pfx-file-path        The path to client certificate file        [string]
      --pfx-file-password    The password of client certificate file    [string]
      --proxy                The URL of a proxy server
                                                 [string] [default: HTTPS_PROXY]
```

#### `--condition` and `--order-by` options

You can filter and reorder records with `--condition` and `--order-by` options.

These options are passed to `getAllRecords()` of [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client#readme).

Refer to the [`getAllRecords()`](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#getallrecords) document for more information.

#### Download attachment files

If set `--attachments-dir` option, attachment files will be downloaded to local directory.

- the file path is `<attachmentsDir>/<fieldCode>-<recordId>/<filename>`
  - as for attachments in Table, the file path is `<attachmentsDir>/<fieldCode>-<recordId>-<tableRowIndex>/<filename>`
- if same name files exist in same Attachment field, renamed to `<filename> (<index>).<ext>`

## Supported file formats

cli-kintone supports following formats for both import/export commands.

- CSV

When importing, it determines the format automatically by the extension of the file (specified by `--file-path` option).

The detailed formats are as follows:

### CSV format

The first row (header row) lists the **field codes** of each field.  
Each subsequent row corresponds to a record. Each value represents the value of the field.

```csv
"Record_number","FieldCode1","FieldCode2"
"1","foo","bar"
"2","baz","qux"
```

Here are considerations for some field types:

#### Text area

If the value contains line break, enclose the value in double quotes.

```csv
"TextAreaField"
"multi
line
text"
```

#### Check box, Multi-choice

Specify multiple values divided by line break (\n).

```csv
"CheckboxField"
"value1
value2"
```

#### User Selection, Department Selection, Group Selection

If multiple value is selected, separated with line break (\n). (equivalent to `value.code` in REST API).

```csv
"userSelectionField","departmentSelectionField","groupSelectionField"
"John
Bob","Development Div","Administrators"
```

#### Created by, Updated by

Specify the user's login name (equivalent to `value.code` in REST API).

```csv
"Created_by"
"John"
```

#### Attachment

Files in same Attachment field (in same Table row) are separated with line break (\n).

```csv
"file"
"file-9/test.txt
file-9/test (1).txt"
```

```csv
"fileInTable"
"fileInTable-1-0/test.txt
fileInTable-1-0/test (1).txt"
```

When export, if NOT set `--attachments-dir` option, only the file name will be output.

```csv
"fileFieldCode"
"test.txt
test.txt"
```

#### Table

- The row where a record begins has a PRIMARY_MARK(`*`) on the “`*`“ field.
- The data of fields outside the Table are specified in the row with PRIMARY_MARK(`*`)
  - The data of fields outside the Table in other rows will be ignored.
- The data of fields inside the Table are specified with one or multiple rows
  - If there is no data about the Table in the row, the row is ignored

```csv
"*","Text","Table","TextInTable"
"*","first","<row id>","alice"
,"first","<row id>","bob"
```

with multiple Table fields

```csv
"*","Text","Table","TextInTable","Table_1","NumberInTable"
"*","first","<row id>","alice",,
,"first","<row id>","bob",,
,"first",,,"<row id>","10"
,"first",,,"<row id>","20"
```

## Command completion

cli-kintone provides a command-completion feature that enables you to use the **Tab** key to complete a partially entered command.

cli-kintone command completion is now supported only for `bash` and `zsh` shell.

### zsh

To enable it in `zsh`, `cd` to the directory that contains the cli-kintone executable file, then run the below commands:

```shell
# 1. Set PATH environment variables
echo "export PATH=$(pwd):\$PATH" >> ~/.zshrc

# 2. Create and configure a directory to store the completion scripts
mkdir -p ~/.zsh_completion.d/
echo 'fpath=(~/.zsh_completion.d $fpath)' >> ~/.zshrc

# 3. Enable bash-autocomplete feature
echo 'autoload bashcompinit && bashcompinit' >> ~/.zshrc
echo 'autoload -Uz compinit && compinit' >> ~/.zshrc

# 4. Create command completion script
./cli-kintone completion >> ~/.zsh_completion.d/_cli-kintone

# 5. Reload zsh
source ~/.zshrc
```

### bash

To enable it in `bash`, `cd` to the directory that contains the cli-kintone executable file, then run the below commands:

```shell
# 1. Create command completion script
mkdir -p ~/.bash_completion.d
./cli-kintone completion >> ~/.bash_completion.d/_cli-kintone

# 2. Add command completion script to bash

# For login shell
echo "export PATH=$(pwd):\$PATH" >> ~/.bash_profile
echo 'source ~/.bash_completion.d/_cli-kintone' >> ~/.bash_profile
source ~/.bash_profile

# For non-login shell
echo "export PATH=$(pwd):\$PATH" >> ~/.bashrc
echo 'source ~/.bash_completion.d/_cli-kintone' >> ~/.bashrc
source ~/.bashrc
```

### For Windows OS

For Windows OS, you can use cli-kintone command completion via `bash` on [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)

Steps:

1. Install Linux on Windows with WSL. Ref: [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)
2. Open a new Linux Terminal
3. Download and extract executables from the [linux package](https://github.com/kintone/cli-kintone/releases).
4. Run the same commands as [bash section](#bash)

## LICENSE

- [MIT](https://github.com/kintone/cli-kintone/blob/main/LICENSE)
