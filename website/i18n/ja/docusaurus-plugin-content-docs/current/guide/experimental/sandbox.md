---
title: プラグインサンドボックス
unlisted: true
---

# プラグインサンドボックス

:::experimental[プラグインサンドボックス対応]

この機能は開発中であり、まだ公開インターフェースの一部ではありません。
フィールド名・バリデーション規則・コマンド出力は予告なく変更される可能性があります。

:::

cli-kintone は `manifest.json` (Manifest v1) のオプショナルフィールドとして
`sandbox` / `allowed_hosts` / `permissions` の 3 つを認識します。これらが
指定されていると、`plugin pack` がバリデーションを行い、`plugin info` が出力に
反映し、`plugin upload` が Installation Summary に含めます。

## フィールド

| フィールド      | 型                                           | 説明                                                                                                                                                                                                                                                                                                                                |
| --------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sandbox`       | `boolean`                                    | このプラグインがサンドボックスに対応しているかを示すフラグ。                                                                                                                                                                                                                                                                        |
| `allowed_hosts` | `string[]`                                   | プラグインがアクセスできる通信先の一覧。各エントリはスキーム付きの URI（例: `https://example.com`, `wss://example.com/ws/*`）またはワイルドカード `"*"`。cli-kintone は構造的な形式のみを検証し、IP アドレスの拒否・末尾スラッシュのみの拒否・サイボウズドメインの除外などのドメイン固有ルールは実行時に kintone 本体が判定します。 |
| `permissions`   | `{ js_api?: string[]; rest_api?: string[] }` | プラグインが要求する API 権限。`js_api` は JS API / JS API Event 用、`rest_api` は REST API 用。                                                                                                                                                                                                                                    |

`sandbox` が `true` の場合、`allowed_hosts` と `permissions` は必須です。
`sandbox` が未指定または `false` の場合、`allowed_hosts` と `permissions` は
任意のままです。

## マニフェスト例

```json
{
  "manifest_version": 1,
  "version": 1,
  "type": "APP",
  "name": { "en": "sandbox-sample" },
  "icon": "image/icon.png",
  "sandbox": true,
  "allowed_hosts": ["https://example.com", "wss://example.com/ws/*"],
  "permissions": {
    "js_api": ["app:read", "network:connect"],
    "rest_api": ["app_record:read"]
  }
}
```

## コマンドごとの挙動

### `plugin pack`

パッケージング前に 3 フィールドをマニフェストスキーマで検証します。バリデーション
エラーがあるとパッケージングを中断し、非ゼロ終了コードを返します。エラーが
無ければ通常どおりプラグイン zip を生成します。

### `plugin info`

`sandbox` / `allowed_hosts` / `permissions` のいずれかがマニフェストに
定義されている場合、`plugin info` はサンドボックス関連 4 行
（`sandbox`、`allowed_hosts`、`permissions.js_api`、`permissions.rest_api`）
をまとめて出力します。どれも未定義のサンドボックス非対応プラグインでは
ブロックごと省略されます。

- `(not set)` — 親フィールド自体がマニフェストに存在しない。
- `(none)` — 親フィールドは宣言されているが要素が空。

plain 出力例:

```text
sandbox: true
allowed_hosts: https://example.com, wss://example.com/ws/*
permissions.js_api: app:read, network:connect
permissions.rest_api: app_record:read
```

JSON 形式では、マニフェストに存在しないキーは出力から省略されます。サンドボックス関連のキーは、ライブラリ内部で用いる camelCase のアクセサ名ではなくマニフェストのキー名（`sandbox`、`allowed_hosts`、`permissions`）をそのまま使います。

### `plugin upload`

`sandbox` / `allowed_hosts` / `permissions` のいずれかがマニフェストに
定義されている場合、Installation Summary にはサンドボックス関連 4 行
（`Sandbox`、`Allowed hosts`、`Permissions (js_api)`、`Permissions (rest_api)`）
がまとめて出力されます。どれも未定義のサンドボックス非対応プラグインでは
追加行は出ません。`(not set)` / `(none)` のプレースホルダは `plugin info` と
同じ意味で使われます。出力例:

```text
  Installation Summary:
    Destination: https://example.cybozu.com
    ...
    Target version: 1
    Sandbox: true
    Allowed hosts: https://example.com, wss://example.com/ws/*
    Permissions (js_api): app:read, network:connect
    Permissions (rest_api): app_record:read
```
