# UPSERT: update or insert records

## Concept

| Term       | Description                                                                                                                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Update key | The field code binds the imported record and the record on the kintone. The following fields are supported:<br/>- Record number field<br/>- The following fields with "Prohibit duplicate values"<br/> - Single-line text<br/> - Number field |
| Upsert     | Update the record if the record matching the update key exists. Otherwise, add a new record.                                                                                                                                                  |

## Command-line interface

```shell
// Specify update key
cli-kintone record import --app 8 --file-path records.csv --update-key companyName
```

| Parameter name | Short name | Description  |
| -------------- | ---------- | ------------ |
| `--update-key` |            | An updatekey |

## Upserting records

Users can specify an update key by `--update-key` option.

- The tool looks up the matching records and performs the following:
  - Update the record if the matching record exists
  - Add a new record if no matching records exist
- Updating and updating perform in the sequence of the CSV order.
- A Record Number field is only evaluated for records to be updated when it is specified as "Key to Bulk Update".
- The following fields in records to be updated are ignored.
  - Created by
  - Created datetime
  - Updated by
  - Updated datetime

An error occurs when the update key has the following condition

- The key does not exist on the CSV file.
- The fields are not configured as “Prohibit duplicate values“

## Specifying record number field

- The record number column can contain the app code, such as Task-1. Every row should contain the same app code.
- The app code is equal to the kintone app's one.

## Errors

- The field specified by the update key does not exist on the kintone app.
- The field specified by the update key is not supported; neither is a single-line text or a number field.
- The field specified by the update key is supported, but it does not have a setting "Prohibit duplicate values".
- When the update key is a record number field, record numbers are mixed, containing or not the app code.
- When the update key is a record number field, record numbers contain the app code other than kintone app's one.
- The field specified by the update key does not exists on the source file.
