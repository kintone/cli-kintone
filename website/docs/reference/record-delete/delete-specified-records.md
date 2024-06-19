# Deleting specified records

## Details

By specifying the option `--file-path`, the `delete` command allows users to delete records from a CSV file.

Command-line interface:

```shell
cli-kintone record delete --api-token <API_Token> --file-path <path_of_csv_file>
```

Example:

```shell
cli-kintone record delete --api-token <API_Token> --file-path records_need_to_be_deleted.csv
```

Currently, this command only supports API Token.

:::note[Why?]
This is because making password authentication available would significantly complicate the specification and implementation or degrade performance.

To check whether a user has record deletion permissions, we need to call the [Evaluate Record Permissions](https://kintone.dev/en/docs/kintone/rest-api/apps/evaluate-record-permissions/) API.
This API can only evaluate 100 record per request.

On the other hand, if we perform record deletion without evaluation, we need to consider a complex retry process.
:::

The CSV file must contain the record number column.
And, the header row of the record number column must be the record number field code which is defined in the kintone site. For example:
The record number field code in kintone: `Record_number`
The content of the CSV file:

```csv
*,"Record_number","Text","Table","Table_Text","Table_Number"
*,"1","sample1","<row_id>","foo","4"
,"1","sample1","<row_id>","bar","5"
*,"2","sample2","<row_id>","hoge","6"
```

The value of the record number column can be either the record number or the app code. For example:

```csv
*,"Record_number","Text","Table","Table_Text","Table_Number"
*,"myapp-1","sample1","<row_id>","foo","4"
,"myapp-1","sample1","<row_id>","bar","5"
*,"myapp-2","sample2","<row_id>","hoge","6"
```

If using the app code, every row should contain the same app code (not mix) and the app code is equal to the kintone app's one.

The user also can specify the encoding of the CSV file. Supported character encodings: `utf8`, `sjis`.

Before the command is executed, the user must confirm the action by answering the prompt yes/no.

```shell
cli-kintone record delete --app ${kintoneAppId} --file-path ${pathToCsvFile}
> Are you sure want to delete records? (y/N)
```

Notes:

- The confirmation message is in English only for now.
- If not specifying the answer, the default answer is No.

Or, the user can specify the option `--yes` or `-y` to execute the command without a prompt.

```shell
cli-kintone record delete --yes --app ${kintoneAppId} --file-path ${pathToCsvFile}
```

Once the command is executed successfully, the below message will be shown.

```shell
INFO: Starting to delete records...
INFO: <number_of_deleted_records> records are deleted successfully
```

## Valid cases

### valid record number value

#### Example input

```csv
Record_number
1
2
3
```

or

```csv
Record_number
appcode-1
appcode-2
appcode-3
```

#### Expected result

All records [1, 2, 3] should be deleted.

what is valid value:

- All record numbers are numeric or appcode, not mixed.
- The app code is equals to the kintone app's one.

#### Expected output

```shell
INFO: Starting to delete records...
INFO: 3 records are deleted successfully
```

## Errors and Warnings

(TBD)
