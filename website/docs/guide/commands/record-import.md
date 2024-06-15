---
sidebar_position: 200
---

# record import

The `import` command allows you to import record data into a specified Kintone app.

## Example

```shell
cli-kintone record import \
  --base-url https://${yourDomain} \
  --api-token ${apiToken} \
  --app ${kintoneAppId} \
  --file-path ${filepath}
```

## Options

See [Options](/guide/options) page for common options.

| Option              | Required | Description                                                               |
| ------------------- | -------- | ------------------------------------------------------------------------- |
| `--app`             | Yes      | The ID of the app                                                         |
| `--attachments-dir` |          | Attachment file directory                                                 |
| `--file-path`       | Yes      | The path to the source file.<br/>The file extension should be ".csv"      |
| `--encoding  `      |          | Character encoding<br/>Default to `utf8`<br/>Encodings: `utf8` and `sjis` |
| `--update-key`      |          | The key to Bulk Update                                                    |
| `--fields  `        |          | The fields to be imported in comma-separated                              |

:::note
A field within a Table cannot be specified to the `fields` option.
:::

## File format

When importing, it automatically determines the format by the file extension (specified by the `--file-path` option).

## Import Attachment field

The `--attachments-dir` option is required if records contain an Attachment field.

- The local file path in the record is treated as a relative path from `--attachments-dir`.
  - Upload the file there.
- The file names on Kintone will be the same as the local.

## Upsert records

When the `--update-key` option is set, the option value is used as "Key to Bulk Update" to import (upsert) records.

"Upsert" means updating and/or inserting records simultaneously. Data containing keys that match existing record values are used to update those records accordingly, and the remaining data is added to the specified app as new records.

The field specified as "Key to Bulk Update" must meet one of the following requirements:

- Be the Record Number field.
- Be one of the following field types with the "Prohibit duplicate values" option enabled:
  - Text
  - Number

### Notes

- When the Record Number field is specified as the "Key to Bulk Update", the field's value may have the target app's code.
- A Record Number field is only evaluated for records to be updated when it is specified as "Key to Bulk Update".
- The following fields in records to be updated are ignored.
  - Created by
  - Created datetime
  - Updated by
  - Updated datetime
