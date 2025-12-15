---
sidebar_position: 100
---

# js-sdkからの移行

このガイドでは、[kintone/js-sdk](https://github.com/kintone/js-sdk)のプラグイン開発ツールからcli-kintoneへ移行する方法を説明します。

## 概要

kintone/js-sdkは、プラグイン開発のためにいくつかのnpmパッケージを提供しています：

- [@kintone/create-plugin](https://www.npmjs.com/package/@kintone/create-plugin) - プラグインテンプレートの作成
- [@kintone/plugin-packer](https://www.npmjs.com/package/@kintone/plugin-packer) - プラグインをzipファイルにパッケージ化
- [@kintone/plugin-uploader](https://www.npmjs.com/package/@kintone/plugin-uploader) - プラグインをkintoneにアップロード

cli-kintoneは、これらのツールを単一のCLIに統合しています。

## ツールの比較

| js-sdkのツール           | cli-kintoneのコマンド                         | 説明                                                                                     |
| ------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| @kintone/create-plugin   | [plugin init](../commands/plugin-init.md)     | 新しいプラグインプロジェクトを初期化                                                     |
| @kintone/plugin-packer   | [plugin pack](../commands/plugin-pack.md)     | プラグインをzipファイルにパッケージング<br/>※秘密鍵の生成は`plugin keygen`コマンドに分離 |
| @kintone/plugin-uploader | [plugin upload](../commands/plugin-upload.md) | プラグインをkintone環境にアップロード                                                    |
| -                        | [plugin keygen](../commands/plugin-keygen.md) | プラグイン用の秘密鍵を生成                                                               |
| -                        | [plugin info](../commands/plugin-info.md)     | プラグイン情報を表示                                                                     |

詳細なインターフェース差分については、[コマンドごとのインターフェース差分](#コマンドごとのインターフェース差分)および[主な違い](#主な違い)を参照してください。

## 移行手順

### 1. cli-kintoneのインストール

まず、cli-kintoneをグローバルまたはプロジェクト内にインストールします。詳細は[インストール](../installation.md)を参照してください。

```shell
npm install @kintone/cli --global
```

### 2. 手順の更新

#### 新しいプラグインの作成

**移行前（js-sdk）：**

```shell
npm init @kintone/plugin
```

**移行後（cli-kintone）：**

```shell
cli-kintone plugin init --name my-plugin --template javascript
```

#### 秘密鍵の生成

js-sdkのcreate-pluginでは、秘密鍵は最初のビルド時に自動的に生成されます。cli-kintoneでは、明示的に生成します：

```shell
cli-kintone plugin keygen --output private.ppk
```

#### プラグインのパッケージ化

**移行前（js-sdk）：**

```shell
kintone-plugin-packer --ppk private.ppk --out plugin.zip src/
```

**移行後（cli-kintone）：**

```shell
cli-kintone plugin pack --input ./src/manifest.json --output ./plugin.zip --private-key ./private.ppk
```

**監視モード：**

```shell
cli-kintone plugin pack --input ./src/manifest.json --output ./plugin.zip --private-key ./private.ppk --watch
```

#### プラグインのアップロード

**移行前（js-sdk）：**

```shell
kintone-plugin-uploader --base-url https://example.cybozu.com --username admin --password password plugin.zip
```

**移行後（cli-kintone）：**

```shell
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password
```

**監視モード：**

```shell
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password --watch
```

#### プラグイン情報の表示

cli-kintoneは、プラグイン情報を表示する追加のコマンドを提供します：

```shell
cli-kintone plugin info --input ./plugin.zip --format json
```

### 3. package.jsonスクリプトの更新

js-sdkツールを使用しているnpmスクリプトがある場合は、cli-kintoneを使用するように更新してください：

**移行前（js-sdk）：**

```json
{
  "scripts": {
    "start": "kintone-plugin-packer --ppk private.ppk --watch src/",
    "build": "kintone-plugin-packer --ppk private.ppk src/",
    "upload": "kintone-plugin-uploader --base-url https://example.cybozu.com --username admin --password password plugin.zip"
  }
}
```

**移行後（cli-kintone）：**

```json
{
  "scripts": {
    "start": "cli-kintone plugin pack --input ./src/manifest.json --private-key ./private.ppk --watch",
    "build": "cli-kintone plugin pack --input ./src/manifest.json --private-key ./private.ppk",
    "upload": "cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password"
  }
}
```

### 4. js-sdkツールのアンインストール（任意）

cli-kintoneへの移行が完了したら、js-sdkツールを削除できます：

```shell
npm uninstall @kintone/create-plugin @kintone/plugin-packer @kintone/plugin-uploader
```

## コマンドごとのインターフェース差分

### plugin init (@kintone/create-plugin との比較)

| オプション       | js-sdk               | cli-kintone                          | 備考                                                    |
| ---------------- | -------------------- | ------------------------------------ | ------------------------------------------------------- |
| プラグイン名     | 対話形式で入力       | `--name <name>` または対話形式で入力 | cli-kintoneは非対話モードに対応                         |
| テンプレート     | 対話形式で選択       | `--template <template>`              | `javascript`, `typescript`, `modern`, `minimum`から選択 |
| 出力ディレクトリ | カレントディレクトリ | `--output <dir>`                     | デフォルトはカレントディレクトリ                        |

**実行例：**

```shell
# js-sdk（対話形式）
npm init @kintone/plugin

# cli-kintone（非対話モード）
cli-kintone plugin init --name my-plugin --template javascript
```

### plugin pack (@kintone/plugin-packer との比較)

| オプション       | js-sdk           | cli-kintone                  | 備考                             |
| ---------------- | ---------------- | ---------------------------- | -------------------------------- |
| 入力ディレクトリ | 位置引数（末尾） | `--input <dir>`, `-i`        | 必須                             |
| 出力ファイル     | `--out <file>`   | `--output <file>`, `-o`      | デフォルトは`plugin.zip`         |
| 秘密鍵           | `--ppk <file>`   | `--private-key <file>`, `-p` | 未指定時は自動生成               |
| 監視モード       | `--watch`        | `--watch`, `-w`              | ファイル変更時に自動再パッケージ |

**実行例：**

```shell
# js-sdk
kintone-plugin-packer --ppk private.ppk --out plugin.zip src/

# cli-kintone
cli-kintone plugin pack --input ./src/manifest.json --output ./plugin.zip --private-key ./private.ppk
```

### plugin upload (@kintone/plugin-uploader との比較)

| オプション   | js-sdk              | cli-kintone            | 備考                             |
| ------------ | ------------------- | ---------------------- | -------------------------------- |
| 入力ファイル | 位置引数（末尾）    | `--input <file>`, `-i` | 必須                             |
| ベースURL    | `--base-url <url>`  | `--base-url <url>`     | kintone環境のURL                 |
| ユーザー名   | `--username <user>` | `--username <user>`    | 認証に使用                       |
| パスワード   | `--password <pass>` | `--password <pass>`    | 認証に使用                       |
| APIトークン  | 非対応              | `--api-token <token>`  | APIトークン認証に対応            |
| プラグインID | 自動検出            | `--plugin-id <id>`     | 更新時に指定（省略時は新規作成） |
| 監視モード   | 非対応              | `--watch`, `-w`        | ファイル変更時に自動アップロード |

**実行例：**

```shell
# js-sdk
kintone-plugin-uploader --base-url https://example.cybozu.com --username admin --password password plugin.zip

# cli-kintone（パスワード認証）
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password

# cli-kintone（APIトークン認証）
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --api-token your-api-token
```

## 主な違い

### コマンド構造

- **js-sdk：** 各ツールは独立したnpmパッケージで、それぞれ独自のコマンドを持ちます
- **cli-kintone：** すべてのプラグインコマンドは`cli-kintone plugin`名前空間の下にあります

### オプション名

一部のオプション名がツール間で異なります：

| 機能                      | js-sdk   | cli-kintone      |
| ------------------------- | -------- | ---------------- |
| 入力ディレクトリ/ファイル | 位置引数 | `--input`, `-i`  |
| 出力ファイル              | `--out`  | `--output`, `-o` |
| 秘密鍵ファイル            | `--ppk`  | `--private-key`  |

### 追加機能

cli-kintoneは、js-sdkにはない機能を提供します：

- **plugin keygen：** 秘密鍵を明示的に生成
- **plugin info：** アップロードせずにプラグインのメタデータを表示
- **統一された認証：** すべてのコマンドで共通の認証オプション

## 移行のメリット

- **単一ツール：** すべてのプラグイン開発タスクに対応する1つのCLI
- **一貫したインターフェース：** 統一されたコマンド構造とオプション
- **優れた統合：** cli-kintoneのレコードコマンドとシームレスに連携
- **活発な開発：** cli-kintoneは積極的にメンテナンスされ、定期的に更新されています

## お困りの場合

移行中に問題が発生した場合：

- [プラグインコマンドのドキュメント](../commands/plugin-init.md)を確認してください
- [トラブルシューティングガイド](../troubleshooting.md)を確認してください
- [GitHub Issues](https://github.com/kintone/cli-kintone/issues)で問題を報告してください

## 参考資料

- [@kintone/plugin-packer - npm](https://www.npmjs.com/package/@kintone/plugin-packer)
- [@kintone/plugin-uploader - npm](https://www.npmjs.com/package/@kintone/plugin-uploader)
- [@kintone/create-plugin - npm](https://www.npmjs.com/package/@kintone/create-plugin)
- [kintone/js-sdk GitHubリポジトリ](https://github.com/kintone/js-sdk)
