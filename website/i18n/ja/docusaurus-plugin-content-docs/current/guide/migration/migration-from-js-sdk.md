---
sidebar_position: 100
---

# js-sdkからの移行

このガイドでは、Kintone js-sdkのプラグインツールからcli-kintoneのプラグインコマンドへ移行する方法を説明します。

## 概要

Kintone js-sdkは、プラグイン開発のためにいくつかのnpmパッケージを提供しています：

- [@kintone/create-plugin](https://www.npmjs.com/package/@kintone/create-plugin) - プラグインテンプレートの作成
- [@kintone/plugin-packer](https://www.npmjs.com/package/@kintone/plugin-packer) - プラグインをzipファイルにパッケージ化
- [@kintone/plugin-uploader](https://www.npmjs.com/package/@kintone/plugin-uploader) - プラグインをKintoneにアップロード

cli-kintoneは、これらのツールを単一のCLIに統合し、統一されたプラグインコマンドを提供します。

## ツールの比較

| js-sdkツール             | cli-kintoneコマンド                           | 説明                                  |
| ------------------------ | --------------------------------------------- | ------------------------------------- |
| @kintone/create-plugin   | [plugin init](../commands/plugin-init.md)     | 新しいプラグインプロジェクトを初期化  |
| @kintone/plugin-packer   | [plugin pack](../commands/plugin-pack.md)     | プラグインをzipファイルにパッケージ化 |
| @kintone/plugin-uploader | [plugin upload](../commands/plugin-upload.md) | プラグインをKintoneにアップロード     |
| -                        | [plugin keygen](../commands/plugin-keygen.md) | プラグイン用の秘密鍵を生成            |
| -                        | [plugin info](../commands/plugin-info.md)     | プラグイン情報を表示                  |

## 移行手順

### 1. cli-kintoneのインストール

まず、cli-kintoneをグローバルまたはプロジェクト内にインストールします。詳細は[インストール](../installation.md)を参照してください。

```shell
npm install @kintone/cli --global
```

### 2. ワークフローの更新

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

js-sdkでは、秘密鍵は最初のビルド時に自動的に生成されます。cli-kintoneでは、明示的に生成できます：

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
cli-kintone plugin pack --input ./src --output ./plugin.zip --private-key ./private.ppk
```

**監視モード：**

```shell
cli-kintone plugin pack --input ./src --output ./plugin.zip --private-key ./private.ppk --watch
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
    "start": "cli-kintone plugin pack --input ./src --private-key ./private.ppk --watch",
    "build": "cli-kintone plugin pack --input ./src --private-key ./private.ppk",
    "upload": "cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password"
  }
}
```

### 4. js-sdkツールのアンインストール（任意）

cli-kintoneへの移行が完了したら、js-sdkツールを削除できます：

```shell
npm uninstall @kintone/create-plugin @kintone/plugin-packer @kintone/plugin-uploader
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
- [Kintone js-sdk GitHubリポジトリ](https://github.com/kintone/js-sdk)
