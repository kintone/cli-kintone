---
sidebar_position: 1310
---

# customize export

`customize export`コマンドは、kintoneアプリのカスタマイズ設定をマニフェストファイルにエクスポートします。

:::experimental

この機能は開発初期段階です。

:::

## 例

```shell
cli-kintone customize export \
  --app 123 \
  --output customize-manifest.json \
  --base-url https://example.cybozu.com \
  --username admin \
  --password password
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション | 必須 | デフォルト値              | 説明                                         |
| ---------- | ---- | ------------------------- | -------------------------------------------- |
| `--app`    | Yes  |                           | カスタマイズ設定をエクスポートするアプリID。 |
| `--output` |      | `customize-manifest.json` | マニフェストファイルの出力先パス。           |
| `--yes`    |      |                           | すべてのプロンプトに「Yes」で回答。          |

## 動作詳細

- ダウンロードしたJS/CSSファイルは`$(dirname $MANIFEST_PATH)/{js,css}/`に保存されます
- マニフェストファイルが既に存在する場合、確認プロンプトが表示されます（デフォルト：No）
- パスワード認証のみサポートしています
