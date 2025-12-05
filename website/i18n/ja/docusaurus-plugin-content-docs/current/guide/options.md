---
sidebar_position: 400
---

# オプション

このページでは、cli-kintoneの共通オプションを紹介します。

:::info
一部のオプションは、デフォルト値として環境変数を使用します。
:::

## 全般

| オプション  | 説明             |
| ----------- | ---------------- |
| `--version` | バージョン番号を表示 |
| `--help`    | ヘルプを表示     |

## ログ

詳細は[ログ](/reference/logging)リファレンスをご覧ください。

| オプション    | 説明                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| `--log-level` | ログ設定レベルを変更<br/>レベル：`debug`、`info`、`warn`、`error`、`fatal`、`none` |
| `--verbose`   | ログ設定レベルを`debug`に設定                                                        |

## 認証

| オプション              | 説明                                                              |
| ----------------------- | ---------------------------------------------------------------- |
| `--base-url`            | KintoneベースURL<br/>デフォルト：`KINTONE_BASE_URL`                |
| `--username`、`-u`      | Kintoneユーザー名<br/>デフォルト：`KINTONE_USERNAME`               |
| `--password`、`-p`      | Kintoneパスワード<br/>デフォルト：`KINTONE_PASSWORD`               |
| `--api-token`           | アプリのAPIトークン<br/>デフォルト：`KINTONE_API_TOKEN`            |
| `--basic-auth-username` | KintoneベーシックSH認証ユーザー名<br/>デフォルト：`KINTONE_BASIC_AUTH_USERNAME` |
| `--basic-auth-password` | Kintoneベーシック認証パスワード<br/>デフォルト：`KINTONE_BASIC_AUTH_PASSWORD` |
| `--pfx-file-path`       | クライアント証明書ファイルのパス                                  |
| `--pfx-file-password`   | クライアント証明書ファイルのパスワード                            |

## ネットワーク

| オプション | 説明                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--proxy` | プロキシサーバーのURL<br/>形式：`http://username:password@host:port`<br/>デフォルト：`HTTPS_PROXY`<br/>詳細は[プロキシ](/reference/proxy/http-proxy)リファレンスをご覧ください。 |

## ゲストスペース

| オプション         | 説明                                                      |
| ------------------ | --------------------------------------------------------- |
| `--guest-space-id` | ゲストスペースのID<br/>デフォルト：`KINTONE_GUEST_SPACE_ID` |
