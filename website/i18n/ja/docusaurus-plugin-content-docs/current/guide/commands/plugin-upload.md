---
sidebar_position: 1600
---

# plugin upload

`plugin upload`コマンドは、プラグインをkintone環境にアップロードします。

:::experimental

この機能は開発初期段階です。

:::

**注意**

- このコマンドはパスワード認証のみをサポートしています。

## 例

```shell
cli-kintone plugin upload --input ./plugin.zip \
  --base-url https://${yourDomain} \
  --username ${yourUsername} \
  --password ${yourPassword}
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション      | 必須 | 説明                          |
| --------------- | ---- | ----------------------------- |
| `--input`、`-i` | はい | プラグインzipファイルのパス。 |
| `--yes`、`-y`   |      | 確認をスキップ。              |
| `--watch`       |      | ウォッチモードで実行。        |
