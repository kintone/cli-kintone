---
sidebar_position: 300
---

# record delete

The `delete` command allows you to delete records of a specified Kintone app.

**Notice**

- This command only supports API token authentication.
- This action cannot be rollback.

## Example

```shell
cli-kintone record delete \
--base-url https://${yourDomain} \
--api-token ${apiToken} \
--app ${kintoneAppId} \
--file-path ${filepath}
```

You can bypass the confirmation step by using the options `--yes` or `-y`.

## Options

See [Options](/options) page for common options.

| Option         | Required | Description                                                               |
| -------------- | -------- | ------------------------------------------------------------------------- |
| `--app`        | Yes      | The ID of the app                                                         |
| `--file-path`  |          | The path to the source file.                                              |
| `--encoding  ` |          | Character encoding<br/>Default to `utf8`<br/>Encodings: `utf8` and `sjis` |
| `--yes`, `-y`  |          | Force to delete records                                                   |

## Delete all records

All records of the target app will be deleted if the option `--file-path` is not specified.

## Delete specific records

Specific records can be deleted by specifying the option `--file-path`.

The value of the `--file-path` must be the path to the CSV file and should meet the following requirements:

- The file extension should be ".csv".
- The header row of the record number column must be the record number field code which is defined in the target app.
- If using the app code in the record number:
  - Every row should contain the same app code (not mixed).
  - The app code is equal to the target app's one.
