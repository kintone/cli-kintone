---
sidebar_position: 1100
---

# plugin info

`plugin info`コマンドは、プラグインzipファイルの情報を表示します。

## 例

```shell
cli-kintone plugin info --input ./plugin.zip
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション      | 必須 | 説明                                                                       |
| --------------- | ---- | -------------------------------------------------------------------------- |
| `--input`、`-i` | はい | プラグインzipファイルのパス。                                              |
| `--format`      |      | 情報の出力形式。<br/>形式：`plain`または`json`。<br/>デフォルト：`plain`。 |
