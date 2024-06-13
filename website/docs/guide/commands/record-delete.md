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
$ cli-kintone record delete \
--base-url https://${yourDomain} \
--api-token ${apiToken} \
--app ${kintoneAppId} \
--file-path ${filepath}
```

You can bypass the confirmation step by using the options `--yes` or `-y`.

## Options

Some options use environment variables starting with `KINTONE_` as default values.

```text
Options:
      --version              Show version number                       [boolean]
      --help                 Show help                                 [boolean]
      --base-url             Kintone Base Url
                                 [string] [required] [default: KINTONE_BASE_URL]
      --api-token            App's API token[array] [default: KINTONE_API_TOKEN]
      --basic-auth-username  Kintone Basic Auth Username
                                 [string] [default: KINTONE_BASIC_AUTH_USERNAME]
      --basic-auth-password  Kintone Basic Auth Password
                                 [string] [default: KINTONE_BASIC_AUTH_PASSWORD]
      --app                  The ID of the app               [string] [required]
      --file-path            The path to the source file.
                             The file extension should be ".csv"        [string]
      --encoding             Character encoding
                                     [choices: "utf8", "sjis"] [default: "utf8"]
      --guest-space-id       The ID of guest space
                                      [string] [default: KINTONE_GUEST_SPACE_ID]
      --pfx-file-path        The path to the client certificate file        [string]
      --pfx-file-password    The password of the client certificate file    [string]
      --proxy                The URL of a proxy server
                                                 [string] [default: HTTPS_PROXY]
  -y, --yes                  Force to delete records                   [boolean]
      --log-level            The log config level
                                     [choices: "debug", "info", "warn", "error", "fatal", "none"] [default: "info"]
      --verbose              Set the log config level to "debug"                                   [boolean]
```

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
