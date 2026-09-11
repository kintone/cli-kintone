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

`permissions` と `allowed_hosts` は他のプロパティと挙動が異なる。
記述を省略するとアプリ側の設定を変更せず、空の配列を指定すると設定を削除する。
`customize init` はこれらを生成せず、`customize export` はアプリに設定がある場合だけ書き出す。

どちらもアプリでセキュアオプションが有効である必要がある。マニフェストに記述があってアプリで無効の場合、`customize apply` は失敗する。先にアプリの設定画面でセキュアオプションを有効にすること。

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
