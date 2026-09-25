---
title: カスタマイズのサンドボックス
unlisted: true
---

# カスタマイズのサンドボックス

:::experimental[カスタマイズのサンドボックス対応]

この機能は開発中であり、まだ公開インターフェースの一部ではありません。
フィールド名・バリデーション規則・コマンド出力は予告なく変更される可能性があります。

:::

[サンドボックス](./sandbox.md)で動く JavaScript / CSS カスタマイズは、アプリがそのカスタマイズに対して宣言した権限と通信先だけを使えます。同じ 2 つの設定は、アプリの設定画面からも編集できます。

cli-kintone は `customize-manifest.json` のオプショナルなプロパティとして `permissions` と `allowed_hosts` の 2 つを認識します。`customize export` がこれらを書き出し、`customize apply` が送信します。

## プロパティ

| プロパティ      | 型                                         | 説明                           |
| --------------- | ------------------------------------------ | ------------------------------ |
| `permissions`   | `{ permission: string, scope?: string }[]` | カスタマイズに許可する権限。   |
| `allowed_hosts` | `string[]`                                 | カスタマイズに許可する通信先。 |

`permission` には `kintone:app_record:read` のように名前空間付きの識別子を指定します。各エントリはプラグインのマニフェストと同じ形なので、権限の記述をプラグインとカスタマイズの間で移せます。カスタマイズでは kintone が `scope` を無視し、`customize export` も書き戻しません。マニフェストに `sandbox` フラグはありません。

`allowed_hosts` の各エントリにはスキームが必要で、パスは含められません（例: `https://example.com`、`https://*.example.com`）。ワイルドカードのエントリと個別の通信先は併記できます。

## マニフェストの例

```json
{
  "scope": "ALL",
  "desktop": {
    "js": ["desktop/js/app.js"],
    "css": []
  },
  "mobile": {
    "js": [],
    "css": []
  },
  "permissions": [{ "permission": "kintone:app_record:read" }],
  "allowed_hosts": ["https://example.com", "https://*.example.com"]
}
```

## コマンドの挙動

### `customize init`

どちらのプロパティも生成しません。生成したマニフェストを `customize apply` に渡しても、アプリ側の設定は変わりません。

### `customize export`

アプリに値がある場合だけ、そのプロパティを書き出します。どちらも使っていないアプリのマニフェストには何も増えず、それを別のアプリに適用しても、そのアプリの権限と通信先は残ります。

### `customize apply`

マニフェストに記述があるプロパティだけを送信します。

- プロパティが無い場合 — アプリ側の設定を変更しません。
- プロパティが空の配列の場合 — アプリ側の設定を削除します。

`permissions` や `allowed_hosts` の型が上記と違うマニフェストは、ファイルを 1 つもアップロードしないまま失敗します。これらの設定に対応していない kintone 環境では、どちらかのプロパティがあるとリクエストで失敗します。

`customize apply` は、知らないプロパティを警告して無視します。
