---
sidebar_position: 400
---

# customize init

`customize init`コマンドは、JavaScript/CSSカスタマイズ用のマニフェストファイルを初期化します。

## 例

```shell
cli-kintone customize init --output customize-manifest.json
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション | 必須 | 説明                                                                     |
| ---------- | ---- | ------------------------------------------------------------------------ |
| `--output` |      | マニフェストファイルの出力パス<br/>デフォルト：`customize-manifest.json` |
| `--yes`    |      | 確認をスキップ                                                           |

## マニフェストファイル

マニフェストファイルは以下の構造を持つJSONファイルです：

| プロパティ      | 型                               | 説明                                                   |
| --------------- | -------------------------------- | ------------------------------------------------------ |
| `scope`         | `"ALL"` \| `"ADMIN"` \| `"NONE"` | カスタマイズのスコープ                                 |
| `desktop.js`    | `string[]`                       | デスクトップ用JSファイル                               |
| `desktop.css`   | `string[]`                       | デスクトップ用CSSファイル                              |
| `mobile.js`     | `string[]`                       | モバイル用JSファイル                                   |
| `mobile.css`    | `string[]`                       | モバイル用CSSファイル                                  |
| `permissions`   | `{ permission: string }[]`       | セキュアオプション利用時にカスタマイズへ許可する権限   |
| `allowed_hosts` | `string[]`                       | セキュアオプション利用時にカスタマイズへ許可する通信先 |

:::experimental[セキュアオプションの設定]

`permissions` と `allowed_hosts` は開発中の機能です。
指定できる権限の語彙と検証ルールは、予告なく変更される場合があります。

:::

セキュアオプションは、カスタマイズをサンドボックスで動かすアプリ設定です。
有効にすると、カスタマイズはアプリが宣言した権限と通信先だけを使えます。

`permissions` と `allowed_hosts` の記述を省略すると、アプリ側の設定を変更しません。
空の配列を指定すると設定を削除します。
`customize init` はこれらを生成せず、`customize export` はアプリに設定がある場合だけ書き出します。

`allowed_hosts` の各要素には、`https://example.com` や `https://*.cybozu.com` のようにスキームを含め、
パスは含めないでください。
`permission` には `kintone:app_record:read` のように名前空間付きの識別子を指定します。
指定できる権限と通信先の形式は、プラグインと同じです。

どちらもアプリでセキュアオプションが有効である必要があります。
マニフェストに記述があってアプリで無効の場合、`customize apply` は失敗します。
先にアプリの設定画面でセキュアオプションを有効にしてください。

### 例

```json
{
  "scope": "ALL",
  "desktop": {
    "js": [
      "https://js.cybozu.com/jquery/3.3.1/jquery.min.js",
      "desktop/js/app.js"
    ],
    "css": ["desktop/css/style.css"]
  },
  "mobile": {
    "js": [],
    "css": []
  }
}
```
