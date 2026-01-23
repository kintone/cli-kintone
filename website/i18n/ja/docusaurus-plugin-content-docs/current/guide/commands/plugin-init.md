---
sidebar_position: 1200
---

# plugin init

`plugin init`コマンドは、新しいkintoneプラグイン開発プロジェクトを初期化します。

## 例

```shell
cli-kintone plugin init \
  --name ${project_name} \
  --template ${template_name}
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション   | 必須 | 説明                                                                                                                               |
| ------------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `--name`     |      | プロジェクト名。<br/>プラグイン名の初期値とプロジェクト生成のターゲットディレクトリとなります。<br/>初期値は`kintone-plugin`です。 |
| `--template` |      | 生成されるプラグインのテンプレート。<br/>デフォルト：`javascript`                                                                  |

## 利用可能なテンプレート

| テンプレート | 説明                                     |
| ------------ | ---------------------------------------- |
| `javascript` | JavaScriptベースのプラグインテンプレート |
| `typescript` | TypeScriptベースのプラグインテンプレート |

詳細は[plugin-templates](https://github.com/kintone/cli-kintone/tree/main/plugin-templates)をご覧ください。

## 対話型プロンプト

`plugin init`を実行すると、以下の情報の入力を求められます：

1. プロジェクト名（`--name`が指定されていない場合）
2. サポートされる各言語のプラグイン名、説明、ウェブサイトURL

## サポートされる言語

- 英語（en）- 必須
- 日本語（ja）
- 中国語（zh）
- スペイン語（es）
