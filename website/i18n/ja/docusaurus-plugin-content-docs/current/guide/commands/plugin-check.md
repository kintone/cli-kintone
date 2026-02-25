---
sidebar_position: 1500
unlisted: true
---

# plugin check

`plugin check`コマンドは、kintoneプラグイン内のJavaScriptファイルに潜在的な問題（内部API/サポート対象外のAPIの使用など）がないかチェックします。

:::experimental

この機能は開発初期段階です。

:::

:::note

このコマンドはnpmからインストールした場合（`npx @kintone/cli`または`npm install -g @kintone/cli`）のみ使用できます。
バイナリファイル版では使用できません。

:::

## 例

```shell
# プラグインzipファイルをチェック
cli-kintone plugin check --input ./plugin.zip

# manifest.jsonを指定してプラグインプロジェクトをチェック
cli-kintone plugin check --input ./src/manifest.json

# JSON形式で結果を出力
cli-kintone plugin check --input ./plugin.zip --format json
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション      | 必須 | 説明                                                                                 |
| --------------- | ---- | ------------------------------------------------------------------------------------ |
| `--input`、`-i` | はい | 入力するプラグインzipファイルまたはmanifest.jsonファイルのパス。                     |
| `--format`      |      | 出力フォーマット。<br/>フォーマット：`plain`または`json`。<br/>デフォルト：`plain`。 |

## チェックルール

`plugin check`コマンドは、プラグイン内のJavaScriptファイルに対して以下のチェックを実行します：

| ルール                                                                                                                                                                            | 説明                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [no-cybozu-data](https://github.com/kintone/js-sdk/blob/230a964e0800412003d46effbbda3cc31f72501c/packages/eslint-plugin/docs/rules/no-cybozu-data.md)                             | 内部APIである`cybozu.data`へのアクセスを検出します。 |
| [no-kintone-internal-selector](https://github.com/kintone/js-sdk/blob/230a964e0800412003d46effbbda3cc31f72501c/packages/eslint-plugin/docs/rules/no-kintone-internal-selector.md) | kintone内部のCSSクラス名の使用を検出します。         |

## 出力フォーマット

### Plainフォーマット（デフォルト）

```
js/script.js
  42:7    error    Accessing `cybozu.data` is not allowed.  (local/no-cybozu-data)

Files checked: 3
Problems: 1 (Errors: 1, Warnings: 0)
```

### JSONフォーマット

```json
{
  "errorCount": 1,
  "warningCount": 0,
  "filesChecked": 3,
  "filesSkipped": 1,
  "files": [
    {
      "filePath": "js/script.js",
      "messages": [
        {
          "ruleId": "local/no-cybozu-data",
          "severity": 2,
          "message": "Accessing `cybozu.data` is not allowed.",
          "line": 42,
          "column": 7
        }
      ],
      "errorCount": 1,
      "warningCount": 0
    }
  ]
}
```
