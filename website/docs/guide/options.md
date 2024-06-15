---
sidebar_position: 400
---

# Options

This page introduces common options of cli-kintone.

:::info
Some options use environment variables as default values.
:::

## General

| Option      | Description         |
| ----------- | ------------------- |
| `--version` | Show version number |
| `--help`    | Show help           |

## Logging

See [Logging](/reference/logging) reference for more details.

| Option        | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| `--log-level` | Change log config level<br/>Levels: `debug`, `info`, `warn`, `error`, `fatal`, `none` |
| `--verbose`   | Set log config level to `debug`                                                       |

## Authentication

| Option                  | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `--base-url`            | Kintone Base URL<br/>Default to `KINTONE_BASE_URL`                       |
| `--username`, `-u`      | Kintone Username<br/>Default to `KINTONE_USERNAME`                       |
| `--password`, `-p`      | Kintone Password<br/>Default to `KINTONE_PASSWORD`                       |
| `--api-token`           | App's API tokens<br/>Default to `KINTONE_API_TOKEN`                      |
| `--basic-auth-username` | Kintone Basic Auth Username<br/>Default to `KINTONE_BASIC_AUTH_USERNAME` |
| `--basic-auth-password` | Kintone Basic Auth Password<br/>Default to `KINTONE_BASIC_AUTH_PASSWORD` |
| `--pfx-file-path`       | The path to the client certificate file                                  |
| `--pfx-file-password`   | The password of the client certificate file                              |

## Network

| Option    | Description                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--proxy` | The URL of a proxy server<br/>Format: `http://username:password@host:port`<br/>Default to `HTTPS_PROXY`<br/>See [Proxy](/reference/proxy/http-proxy) reference for more details. |
