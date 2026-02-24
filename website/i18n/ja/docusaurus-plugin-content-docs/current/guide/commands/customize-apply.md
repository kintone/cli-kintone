---
sidebar_position: 600
---

# customize apply

`customize apply`コマンドは、マニフェストファイルからKintoneアプリにJavaScript/CSSカスタマイズを適用します。

**注意**

- このコマンドはパスワード認証のみをサポートしています。

## 例

```shell
cli-kintone customize apply \
  --base-url https://${yourDomain} \
  --app ${appId} \
  --username ${username} \
  --password ${password} \
  --input customize-manifest.json
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション | 必須 | 説明                       |
| ---------- | ---- | -------------------------- |
| `--app`    | はい | アプリのID                 |
| `--input`  | はい | マニフェストファイルのパス |
| `--yes`    |      | 確認をスキップ             |

## 注意

- マニフェスト内のファイルパスは、マニフェストファイルの場所からの相対パスとして解決されます。
- マニフェストにはローカルファイルとURL（例：CDN）の両方を指定できます。
