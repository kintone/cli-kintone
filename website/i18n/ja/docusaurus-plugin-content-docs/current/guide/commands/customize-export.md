---
sidebar_position: 500
---

# customize export

`customize export`コマンドは、KintoneアプリからJavaScript/CSSカスタマイズ設定をエクスポートします。

**注意**

- このコマンドはパスワード認証のみをサポートしています。

## 例

```shell
cli-kintone customize export \
  --base-url https://${yourDomain} \
  --app ${appId} \
  --username ${username} \
  --password ${password} \
  --output customize-manifest.json
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション | 必須 | 説明                                                                     |
| ---------- | ---- | ------------------------------------------------------------------------ |
| `--app`    | はい | アプリのID                                                               |
| `--output` |      | マニフェストファイルの出力パス<br/>デフォルト：`customize-manifest.json` |
| `--yes`    |      | 確認をスキップ                                                           |

## 出力

ダウンロードされたJS/CSSファイルは、マニフェストファイルからの相対パスでディレクトリに保存されます：

```
{manifest-dir}/
├── customize-manifest.json
├── desktop/
│   ├── js/
│   └── css/
└── mobile/
    ├── js/
    └── css/
```

生成されるマニフェストファイルには以下が含まれます：

- CDNリソースのURL（そのまま保持）
- ダウンロードされたファイルの相対パス（例：`desktop/js/app.js`）
