---
sidebar_position: 400
---

# customize init

`customize init`コマンドは、JavaScript/CSSカスタマイズ用のマニフェストファイルを初期化します。

:::experimental

この機能は開発初期段階です。

:::

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

| プロパティ    | 型                               | 説明                      |
| ------------- | -------------------------------- | ------------------------- |
| `scope`       | `"ALL"` \| `"ADMIN"` \| `"NONE"` | カスタマイズのスコープ    |
| `desktop.js`  | `string[]`                       | デスクトップ用JSファイル  |
| `desktop.css` | `string[]`                       | デスクトップ用CSSファイル |
| `mobile.js`   | `string[]`                       | モバイル用JSファイル      |
| `mobile.css`  | `string[]`                       | モバイル用CSSファイル     |

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
