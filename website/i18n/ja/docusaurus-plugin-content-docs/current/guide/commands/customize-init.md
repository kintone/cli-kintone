---
sidebar_position: 1300
---

# customize init

`customize init`コマンドは、新しいカスタマイズマニフェストファイルを初期化します。

:::experimental

この機能は開発初期段階です。

:::

## 例

```shell
cli-kintone customize init \
  --output customize-manifest.json
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション | 必須 | デフォルト値              | 説明                                |
| ---------- | ---- | ------------------------- | ----------------------------------- |
| `--output` |      | `customize-manifest.json` | マニフェストファイルの出力先パス。  |
| `--yes`    |      |                           | すべてのプロンプトに「Yes」で回答。 |

## 対話型プロンプト

`customize init`を実行すると、以下の情報の入力を求められます：

1. スコープ（ALL, ADMIN, NONE） - デフォルト：`ALL`
2. ファイルが既に存在する場合、上書き確認
