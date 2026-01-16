---
sidebar_position: 100
---

# js-sdkからの移行

このガイドでは、[kintone/js-sdk](https://github.com/kintone/js-sdk)のプラグイン/カスタマイズ開発ツールからcli-kintoneへ移行する方法を説明します。

## 概要

kintone/js-sdkは、プラグイン/カスタマイズ開発のためにいくつかのnpmパッケージを提供しています：

- [@kintone/create-plugin](https://www.npmjs.com/package/@kintone/create-plugin) - プラグインテンプレートの作成
- [@kintone/plugin-packer](https://www.npmjs.com/package/@kintone/plugin-packer) - プラグインをzipファイルにパッケージ化
- [@kintone/plugin-uploader](https://www.npmjs.com/package/@kintone/plugin-uploader) - プラグインをkintoneにアップロード
- [@kintone/customize-uploader](https://www.npmjs.com/package/@kintone/customize-uploader) - アプリカスタマイズをkintoneにアップロード/ダウンロード

cli-kintoneは、これらのツールを単一のCLIに統合しています。

## なぜcli-kintoneに移行するのか

kintone/js-sdkから[cli-kintone](https://github.com/kintone/cli-kintone)への移行には、以下のようなメリットがあります：

- 導入・学習コストの集約
- インターフェースと動作の改善

### 導入・学習コストの集約

kintone/js-sdkでは、プラグイン開発に必要な機能が複数のnpmパッケージに分散していました。
それぞれのパッケージを個別にインストールし、異なるコマンドとオプションを学習する必要がありました。

cli-kintoneでは、これらすべての機能を1つのCLIに統合しています。単一のツールをインストールするだけで、プラグインの作成からアップロードまでのすべての操作が可能になり、学習コストが大幅に削減されます。
また、`cli-kintone plugin`という統一された名前空間のもとで、一貫したコマンド構造とオプション名を採用しています。

### インターフェースと動作の改善

cli-kintoneでは、kintone/js-sdkの使用経験から得られたフィードバックをもとに、以下のような改善を行っています：

- **明示的な秘密鍵生成**: 秘密鍵の生成を専用の`plugin keygen`コマンドに分離し、鍵の生成の挙動がより明確になりました
- **一貫したオプション設計**: すべてのコマンドで統一されたオプション名（`--input`、`--output`など）を採用し、直感的に使えるようになりました
- **追加機能**: `plugin info`コマンドにより、プラグイン情報を確認できるようになりました

また、一部のコマンドでは従来のjs-sdkから内部動作の改善を行なっています：

- plugin upload: kintone REST APIを利用するため、RPAで動作していた従来のplugin-uploaderに比べてアップロード時の動作が安定・高速化しています

## ツールの比較

| js-sdkのツール              | cli-kintoneのコマンド                               | 説明                                                                                     |
| --------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| @kintone/create-plugin      | [plugin init](../commands/plugin-init.md)           | 新しいプラグインプロジェクトを初期化                                                     |
| @kintone/plugin-packer      | [plugin pack](../commands/plugin-pack.md)           | プラグインをzipファイルにパッケージング<br/>※秘密鍵の生成は`plugin keygen`コマンドに分離 |
| @kintone/plugin-packer      | [plugin keygen](../commands/plugin-keygen.md)       | プラグイン用の秘密鍵を生成                                                               |
| @kintone/plugin-uploader    | [plugin upload](../commands/plugin-upload.md)       | プラグインをkintone環境にアップロード                                                    |
| -                           | [plugin info](../commands/plugin-info.md)           | プラグイン情報を表示                                                                     |
| @kintone/customize-uploader | [customize init](../commands/customize-init.md)     | カスタマイズのマニフェストファイルの初期化                                               |
| @kintone/customize-uploader | [customize apply](../commands/customize-apply.md)   | マニフェストファイルからkintone環境にカスタマイズを反映                                  |
| @kintone/customize-uploader | [customize export](../commands/customize-export.md) | kintone環境からカスタマイズのマニフェストファイルを生成                                  |

### 主な違い {#key-differences}

#### コマンド構造

- **js-sdk：** 各ツールは独立したnpmパッケージで、それぞれ独自のコマンドを持ちます
- **cli-kintone：** すべての開発用コマンドは`cli-kintone plugin`と`cli-kintone customize`名前空間の下にあります

#### オプション名

一部のオプション名がツール間で異なります：

| 機能                      | js-sdk   | cli-kintone      |
| ------------------------- | -------- | ---------------- |
| 入力ディレクトリ/ファイル | 位置引数 | `--input`, `-i`  |
| 出力ファイル              | `--out`  | `--output`, `-o` |
| 秘密鍵ファイル            | `--ppk`  | `--private-key`  |

詳細なインターフェース差分については、[コマンドごとのインターフェース・挙動差分](#command-interface-differences)および[主な違い](#key-differences)を参照してください。

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
kintone-create-plugin my-plugin
```

**移行後（cli-kintone）：**

```shell
cli-kintone plugin init --name my-plugin
```

#### 秘密鍵の生成

js-sdkのcreate-pluginでは、秘密鍵は最初のビルド時に自動的に生成されます。cli-kintoneでは、plugin initの実行時に生成されます。改めて生成したい場合はkeygenコマンドを実行します：

```shell
cli-kintone plugin keygen --output private.ppk
```

#### プラグインのパッケージ化

**移行前（js-sdk）：**

```shell
kintone-plugin-packer --ppk private.ppk --out plugin.zip ./src/
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

cli-kintoneは、プラグインのID、バージョン、名前などの基本情報を表示する追加のコマンドを提供します：

```shell
cli-kintone plugin info --input ./plugin.zip --format json
# {
#   "id": "pgcfbflalhmhegedmocldhknhpmfmpji",
#   "name": "kintone-plugin",
#   "version": 1,
#   "description": "kintone-plugin",
#   "homepage": null
# }
```

#### カスタマイズのマニフェストファイルの初期化

**移行前（js-sdk）：**

```shell
kintone-customize-uploader init
```

**移行後（cli-kintone）：**

```shell
cli-kintone customize init
```

#### kintone環境からマニフェストファイルを生成

**移行前（js-sdk）：**

```shell
kintone-customize-uploader import customize-manifest.json --base-url https://example.cybozu.com --username admin --password password
```

**移行後（cli-kintone）：**

```shell
cli-kintone customize export --app 123 --output customize-manifest.json --base-url https://example.cybozu.com --username admin --password password
```

#### カスタマイズの適用

**移行前（js-sdk）：**

```shell
kintone-customize-uploader customize-manifest.json --base-url https://example.cybozu.com --username admin --password password
```

**移行後（cli-kintone）：**

```shell
cli-kintone customize apply --input customize-manifest.json --app 123 --base-url https://example.cybozu.com --username admin --password password
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

## コマンドごとのインターフェース・挙動差分 {#command-interface-differences}

### plugin init (@kintone/create-plugin との比較)

| オプション                    | js-sdk                                                                               | cli-kintone                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| プラグイン名                  | コマンドライン引数で入力                                                             | `--name <name>` オプションまたは対話形式で入力<br/>デフォルト値は`kintone-plugin`                                         |
| テンプレート                  | `minimum` または `modern`が選択可能<br/>デフォルト値は`minimum`                      | `javascript` または `typescript`が選択可能<br/>デフォルト値は`javascript`                                                 |
| plugin-uploaderのインストール | インストールするかどうかを対話形式で確認<br/>デフォルト値は`No` (インストールしない) | デフォルトでcli-kintoneをインストールします。<br/>開発用スクリプトでは`plugin upload`コマンドを利用するように設定されます |
| `--lang`オプション            | コマンド実行中の表示言語を指定できます                                               | `--lang`オプションは廃止され、英語での表示のみになりました                                                                |

**実行例：**

```shell
# js-sdk
kintone-create-plugin my-plugin --template minimum

# cli-kintone
cli-kintone plugin init --name my-plugin --template javascript
```

### plugin pack (@kintone/plugin-packer との比較)

| オプション   | js-sdk                                                           | cli-kintone                                                                                              |
| ------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 入力ソース   | コマンドライン引数<br/>manifest.jsonの存在するディレクトリを指定 | `--input <dir>`, `-i`<br/>manifest.json自体のパスを指定                                                  |
| 出力ファイル | `--out <file>`                                                   | `--output <file>`, `-o`<br/>デフォルトは`plugin.zip`                                                     |
| 秘密鍵       | `--ppk <file>`<br/>未指定時は自動生成                            | `--private-key <file>`, `-p`<br/>自動生成せず、事前にplugin keygenコマンドで生成してもらう必要があります |

**実行例：**

```shell
# js-sdk
kintone-plugin-packer --ppk private.ppk --out plugin.zip src/

# cli-kintone
cli-kintone plugin pack --input ./src/manifest.json --output ./plugin.zip --private-key ./private.ppk
```

### plugin upload (@kintone/plugin-uploader との比較)

| オプション     | js-sdk             | cli-kintone                                                                                                                                |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 入力ファイル   | コマンドライン引数 | `--input <file>`, `-i`                                                                                                                     |
| 確認プロンプト | なし               | アップロード直前に操作（追加・更新）の確認プロンプトが表示されます<br/>プロンプト表示せずに実行するには`--yes`オプションを指定してください |

**実行例：**

```shell
# js-sdk
kintone-plugin-uploader --base-url https://example.cybozu.com --username admin --password password plugin.zip

# cli-kintone
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password
```

### customize init (@kintone/customize-uploader との比較)

| オプション     | js-sdk                                       | cli-kintone                                                         |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| 出力ファイル   | `--dest-dir`, `-d`<br/>デフォルト値は`dest/` | `--output <file>`, `-o`<br/>デフォルト値は`customize-manifest.json` |
| アプリID       | 対話形式で入力                               | 不要（initでは使用しない）                                          |
| スコープ       | 対話形式で入力                               | 常に`ALL`（変更不可）                                               |
| 確認プロンプト | なし                                         | 上書きの場合はプロンプトで確認<br/>`--yes`オプションでスキップ可能  |

**実行例：**

```shell
# js-sdk
kintone-customize-uploader init

# cli-kintone
cli-kintone customize init
```

### customize export (@kintone/customize-uploader との比較)

cli-kintoneの`customize export`コマンドは、customize-uploaderの`import`サブコマンドに相当します。

| オプション     | js-sdk                                        | cli-kintone                                                         |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| コマンド名     | `import`サブコマンド                          | `export`サブコマンド                                                |
| アプリID       | マニフェストファイル内の`app`プロパティで指定 | `--app <id>`, `-a`（必須）                                          |
| 出力ファイル   | マニフェストファイルを引数で指定              | `--output <file>`, `-o`<br/>デフォルト値は`customize-manifest.json` |
| 確認プロンプト | なし                                          | 上書きの場合はプロンプトで確認<br/>`--yes`オプションでスキップ可能  |
| 認証方式       | ユーザー名/パスワード、OAuth                  | ユーザー名/パスワードのみ<br/>APIトークン認証・OAuth認証は非対応    |
| ファイル出力先 | マニフェストと同じディレクトリ                | `$(dirname $MANIFEST_PATH)/{desktop,mobile}/{js,css}/`に保存        |

**実行例：**

```shell
# js-sdk
kintone-customize-uploader import customize-manifest.json --base-url https://example.cybozu.com --username admin --password password

# cli-kintone
cli-kintone customize export --app 123 --output customize-manifest.json --base-url https://example.cybozu.com --username admin --password password
```

### customize apply (@kintone/customize-uploader との比較)

| オプション     | js-sdk                                              | cli-kintone                                                                        |
| -------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| アプリID       | マニフェストファイル内の`app`プロパティで指定       | `--app <id>`, `-a`（必須）<br/>マニフェストファイルの`app`プロパティは無視されます |
| 入力ファイル   | マニフェストファイルを引数で指定                    | `--input <file>`, `-i`（必須）                                                     |
| 確認プロンプト | なし                                                | 反映前にプロンプトで確認<br/>`--yes`オプションでスキップ可能                       |
| 認証方式       | ユーザー名/パスワード、OAuth                        | ユーザー名/パスワードのみ<br/>APIトークン認証・OAuth認証は非対応                   |
| 監視モード     | `--watch`オプションでファイル変更を監視して自動反映 | 非対応                                                                             |

**実行例：**

```shell
# js-sdk
kintone-customize-uploader customize-manifest.json --base-url https://example.cybozu.com --username admin --password password

# cli-kintone
cli-kintone customize apply --input customize-manifest.json --app 123 --base-url https://example.cybozu.com --username admin --password password
```

### マニフェストファイルの仕様

cli-kintoneのマニフェストファイルは、customize-uploaderのマニフェストファイルと同じ形式をサポートしています。

```json
{
  "scope": "ALL",
  "desktop": {
    "js": [
      "https://js.cybozu.com/jquery/3.3.1/jquery.min.js",
      "sample/customize.js"
    ],
    "css": ["sample/51-modern-default.css"]
  },
  "mobile": {
    "js": ["https://js.cybozu.com/jquery/3.3.1/jquery.min.js"],
    "css": []
  }
}
```

| プロパティ  | 必須 | 型                               | 説明                                                                                                |
| ----------- | ---- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| scope       | Yes  | `"ALL"` \| `"ADMIN"` \| `"NONE"` | カスタマイズの適用範囲<br/>ALL: すべてのユーザー<br/>ADMIN: アプリの管理者だけ<br/>NONE: 適用しない |
| desktop     | Yes  | object                           | PCビューに適用されるカスタマイズファイル群                                                          |
| desktop.js  | Yes  | string[]                         | PCビューに適用されるJSファイル（URLまたはローカルファイルパス）                                     |
| desktop.css | Yes  | string[]                         | PCビューに適用されるCSSファイル（URLまたはローカルファイルパス）                                    |
| mobile      | Yes  | object                           | モバイルビューに適用されるカスタマイズファイル群                                                    |
| mobile.js   | Yes  | string[]                         | モバイルビューに適用されるJSファイル（URLまたはローカルファイルパス）                               |
| mobile.css  | Yes  | string[]                         | モバイルビューに適用されるCSSファイル（URLまたはローカルファイルパス）                              |

:::info 後方互換性
customize-uploaderとの後方互換性のため、マニフェストファイルに`app`プロパティが存在しても正常に処理されます。ただし、cli-kintoneでは`app`プロパティは無視され、`--app`オプションで指定したアプリIDが使用されます。
:::

## お困りの場合

移行中に問題が発生した場合：

- [プラグインコマンドのドキュメント](../commands/plugin-init.md)を確認してください
- [トラブルシューティングガイド](../troubleshooting.md)を確認してください
- [GitHub Issues](https://github.com/kintone/cli-kintone/issues)で問題を報告してください

## 参考資料

- [@kintone/plugin-packer - npm](https://www.npmjs.com/package/@kintone/plugin-packer)
- [@kintone/plugin-uploader - npm](https://www.npmjs.com/package/@kintone/plugin-uploader)
- [@kintone/create-plugin - npm](https://www.npmjs.com/package/@kintone/create-plugin)
- [@kintone/customize-uploader - npm](https://www.npmjs.com/package/@kintone/customize-uploader)
- [kintone/js-sdk GitHubリポジトリ](https://github.com/kintone/js-sdk)
