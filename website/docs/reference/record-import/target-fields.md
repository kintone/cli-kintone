# Specify target fields

## Command-line interface

```shell
cli-kintone record import --app 8 --file-path records.csv --fields 'Number,Text'
```

| Parameter name | Short name | Description                                |
| -------------- | ---------- | ------------------------------------------ |
| `--fields`     |            | Comma-separated field codes to be imported |

:::info
When specifying `--fields` option, It will change the field's behavior described at: [Fields](./fields).

Please check the below section for more details.
:::

## Target fields variation

### Specify target fields

Only specified fields are imported

```shell
cli-kintone record import --app 27 --file-path records.csv --fields "Record_number,Text"
```

### Specify a table field

All fields on the table are imported

```shell
cli-kintone record import --app 27 --file-path records.csv --fields Table
```

### The target fields do not include the update key

The update key is appended to target fields automatically

```shell
cli-kintone record import --app 27 --file-path records.csv \
    --update-key UniqueText \
    --fields Number
# The UniqueText field is appended to the target fields, and import is finished successfully
```

### --field option, kintone filed code, and CSV columns

| --field parameter | Fields codes on the kintone app | Column names on the CSV | The expectation                                                                                     |
| ----------------- | ------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| A, B              | A, B                            | A, B                    | Import A and B                                                                                      |
| A, B              | A                               | A                       | An error occurs, because the kintone app have a field A and the CSV file does not have a column B   |
| A, B              | A, B                            | A                       | An error occues, because the CSV files does not have a column B                                     |
| A, B              | A                               | A, B                    | An error occues, because the kintone app does not have the field B                                  |
| A                 | A, B                            | A                       | Import A                                                                                            |
| A                 | A                               | A, B                    | Import A                                                                                            |
| A                 | B                               | B                       | An error occurs, because the kintone app have the field B and the CSV file does not have a column A |
| not specified     | A, B                            | A, B                    | Import A and B                                                                                      |
| not specified     | A                               | A, B                    | Import A                                                                                            |

### Errors

#### Specified the field inside the table

```shell
cli-kintone record import --app 27 --file-path records.csv --fields textInTable
Error: The specified field "textInTable" in a table cannot be specified to fields option
```

#### Specified the Table field with empty values

```shell
# records.csv as below
# "*","Text_0","Table","Text","Number"
# "*","Alice",,,
cli-kintone record import --app 27 --file-path records.csv --fields Table
Error: The specified field "Table" does not exist on the CSV
```

#### Specified PRIMARY_MARK(`*`)

```shell
cli-kintone record import --app 27 --file-path records.csv --fields '*'
Error:The specified field "*" does not exist on the app
```

#### Specified the field that does not exist on the Kintone app

```shell
cli-kintone record import --app 27 --file-path records.csv --fields KintoneHyperField
Error:The specified field "KintoneHyperField" does not exist on the app
```

#### Specified unsupported field

```shell
cli-kintone record import --app 27 --file-path records.csv --fields Category
Error:The specified field "Category" is not supported
```

#### Specified the field that does not exist on the CSV file

```shell
# records.csv does not have Text column
cli-kintone record import --app 27 --file-path records.csv --fields Text,Number
Error: The specified field "Text" does not exist on the CSV
```
