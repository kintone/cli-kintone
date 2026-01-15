---
sidebar_position: 1320
---

# customize apply

`customize apply`コマンドは、マニフェストファイルからkintoneアプリにカスタマイズ設定を適用します。

:::experimental

この機能は開発初期段階です。

:::

## 例

```shell
cli-kintone customize apply \
  --input customize-manifest.json \
  --app 123 \
  --base-url https://example.cybozu.com \
  --username admin \
  --password password
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション | 必須 | デフォルト値 | 説明                                 |
| ---------- | ---- | ------------ | ------------------------------------ |
| `--input`  | Yes  |              | マニフェストファイルの入力元パス。   |
| `--app`    | Yes  |              | カスタマイズ設定を適用するアプリID。 |
| `--yes`    |      |              | すべてのプロンプトに「Yes」で回答。  |

## 動作詳細

- 適用前に確認プロンプトが表示されます（デフォルト：No）
- マニフェストファイル内の相対パスは、マニフェストファイルの場所からの相対パスとして解決されます
- パスワード認証のみサポートしています

## マニフェストファイル

マニフェストファイルの仕様については、[customize init](./customize-init.md)を参照してください。
