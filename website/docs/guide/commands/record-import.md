---
sidebar_position: 200
---

# record import

The `import` command allows you to import record data into a specified Kintone app.

## Example

```shell
$ cli-kintone record import \
--base-url https://${yourDomain} \
--api-token ${apiToken} \
--app ${kintoneAppId} \
--file-path ${filepath}
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
      --file-path            The path to the source file.
                             The file extension should be ".csv"
                                                             [string] [required]
      --encoding             Character encoding
                                     [choices: "utf8", "sjis"] [default: "utf8"]
      --update-key           The key to Bulk Update                     [string]
      --fields               The fields to be imported in comma-separated
                                                                        [string]
      --pfx-file-path        The path to the client certificate file        [string]
      --pfx-file-password    The password of the client certificate file    [string]
      --proxy                The URL of a proxy server
                                                 [string] [default: HTTPS_PROXY]
      --log-level            The log config level
                                     [choices: "debug", "info", "warn", "error", "fatal", "none"] [default: "info"]
      --verbose              Set the log config level to "debug"            [boolean]
```

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
