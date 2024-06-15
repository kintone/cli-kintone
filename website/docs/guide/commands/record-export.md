---
sidebar_position: 100
---

# record export

The `export` command allows you to export record data from a specified Kintone app.

## Example

```shell
$ cli-kintone record export \
--base-url https://${yourDomain} \
--api-token ${apiToken} \
--app ${kintoneAppId} \
> ${filepath}
```

## Options

See [Options](/options) page for common options.

| Option              | Required | Description                                                               |
| ------------------- | -------- | ------------------------------------------------------------------------- |
| `--app`             | Yes      | The ID of the app                                                         |
| `--attachments-dir` |          | Attachment file directory                                                 |
| `--condition`, `-c` |          | The query string                                                          |
| `--order-by`        |          | The sort order as a query                                                 |
| `--fields`          |          | The fields to be exported in comma-separated                              |
| `--encoding  `      |          | Character encoding<br/>Default to `utf8`<br/>Encodings: `utf8` and `sjis` |
| `--yes`             |          | Force to delete records                                                   |

### Notes

- A field within a Table cannot be specified to the `fields` option.

## `--condition` and `--order-by` options

You can filter and reorder records with `--condition` and `--order-by` options.

These options are passed to `getAllRecords()` of [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client#readme).

Refer to the [`getAllRecords()`](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#getallrecords) document for more information.

## Download attachment files

If the `--attachments-dir` option is set, attachment files will be downloaded to the local directory.

- The file path is `<attachmentsDir>/<fieldCode>-<recordId>/<filename>`.
  - For attachment fields in a Table, the file path is `<attachmentsDir>/<fieldCode>-<recordId>-<tableRowIndex>/<filename>`.
- For files with the same name in the same Attachment field, the files will be renamed to `<filename> (<index>).<ext>`.
