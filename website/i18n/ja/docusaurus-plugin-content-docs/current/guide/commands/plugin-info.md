---
sidebar_position: 1100
---

# plugin info

`plugin info`コマンドは、プラグインzipファイルの情報を表示します。

:::experimental

この機能は開発初期段階です。

:::

## 例

```shell
cli-kintone plugin info --input ./plugin.zip
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション      | 必須 | 説明                                                                   |
| --------------- | ---- | ---------------------------------------------------------------------- |
| `--input`、`-i` | はい | 入力するプラグインzipファイルのパス。                                  |
| `--format`      |      | 出力形式。<br/>形式：`plain`または`json`。<br/>デフォルト：`plain`。 |
