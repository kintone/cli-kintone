---
sidebar_position: 1400
---

# plugin pack

`plugin pack`コマンドは、kintoneプラグインプロジェクトをパッケージ化します。

## 例

```shell
cli-kintone plugin pack \
  --input ./src/manifest.json \
  --output ./dist/plugin.zip \
  --private-key ./key.ppk
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション       | 必須 | 説明                                                                                                            |
| ---------------- | ---- | --------------------------------------------------------------------------------------------------------------- |
| `--input`、`-i`  | はい | プラグインマニフェストファイルのパス。                                                                          |
| `--output`、`-o` |      | プラグインzipファイルを生成する出力先ファイルパス。<br/>デフォルト：`./plugin.zip`。                            |
| `--private-key`  | はい | 秘密鍵ファイルのパス。秘密鍵をお持ちでない場合は、[`plugin keygen`](./plugin-keygen.md)コマンドで生成できます。 |
| `--watch`        |      | ウォッチモードで実行。                                                                                          |
