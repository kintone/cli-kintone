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

| プロパティ      | 型                         | 説明                           |
| --------------- | -------------------------- | ------------------------------ |
| `permissions`   | `{ permission: string }[]` | カスタマイズに許可する権限。   |
| `allowed_hosts` | `string[]`                 | カスタマイズに許可する通信先。 |

`permission` には `kintone:app_record:read` のように名前空間付きの識別子を指定します。プラグインのマニフェストと違い、各エントリは `scope` を取らず、マニフェストに `sandbox` フラグもありません。

`allowed_hosts` の各エントリにはスキームが必要で、パスは含められません（例: `https://example.com`、`https://*.cybozu.com`）。ワイルドカードのエントリと個別の通信先は併記できます。

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
  "allowed_hosts": ["https://example.com", "https://*.cybozu.com"]
}
```

## コマンドの挙動

### `customize init`

どちらのプロパティも生成しません。`customize init` が生成したマニフェストを apply しても、アプリ側の設定は変わりません。

### `customize export`

アプリに値がある場合だけ、そのプロパティを書き出します。どちらも使っていないアプリのマニフェストには何も増えません。

このため、書き出したマニフェストが別のアプリの設定を削除することはありません。別のアプリに apply しても、そのアプリの権限と通信先は残ります。

### `customize apply`

マニフェストに記述があるプロパティだけを送信します。

- プロパティが無い場合 — アプリ側の設定を変更しません。
- プロパティが空の配列の場合 — アプリ側の設定を削除します。

この 2 つは別のリクエストです。現在の権限を保ちたいマニフェストは、`customize export` が書き出した値を繰り返すのではなく、プロパティを省略します。

kintone 環境がこれらの設定に対応していない場合、どちらかのプロパティがあると `customize apply` は失敗します。

## customize-uploader と同じマニフェストを使う

cli-kintone は [customize-uploader](../migration/migration-from-js-sdk.md) のマニフェストをそのまま読み込めます。この 2 つのプロパティは cli-kintone 固有のため、その逆はできません。

customize-uploader はマニフェストのプロパティをそのままカスタマイズの更新 API へ渡します。そのため `permissions` を書いたマニフェストは、これらの設定に対応していない環境では customize-uploader でエラーになります。customize-uploader と共用するマニフェストには、どちらも書かないでください。
