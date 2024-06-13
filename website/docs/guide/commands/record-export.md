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

Some options use environment variables starting with `KINTONE_` as default values.

```text
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
      --pfx-file-path        The path to the client certificate file        [string]
      --pfx-file-password    The password of the client certificate file    [string]
      --proxy                The URL of a proxy server
                                                 [string] [default: HTTPS_PROXY]
      --log-level            The log config level
                                     [choices: "debug", "info", "warn", "error", "fatal", "none"] [default: "info"]
      --verbose              Set the log config level to "debug"                                   [boolean]
```

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
