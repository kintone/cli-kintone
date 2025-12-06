---
sidebar_position: 1300
---

# plugin keygen

`plugin keygen`コマンドは、プラグイン用の秘密鍵を生成します。

:::experimental

この機能は開発初期段階です。

:::

## 例

```shell
cli-kintone plugin keygen --output private.ppk
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション       | 必須 | 説明                                                          |
| ---------------- | ---- | ------------------------------------------------------------- |
| `--output`、`-o` |      | 出力する秘密鍵ファイルのパス。デフォルト：`./${plugin_id}.ppk` |
