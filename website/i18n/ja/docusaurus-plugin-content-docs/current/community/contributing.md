---
sidebar_position: 200
---

# 貢献

私たちは常に貢献を歓迎しています！このドキュメントでは cli-kintone への貢献方法を説明します。

## 行動規範

貢献を始める前に、まず[行動規範](https://github.com/kintone/.github/blob/main/docs/CODE_OF_CONDUCT.md)をご確認ください。

## サポートリソース

質問やフィードバックがある場合は、[サポートリソース](/community)をご確認ください。

## Issues

バグレポートや機能リクエストには [GitHub Issues](https://github.com/kintone/cli-kintone/issues) を使用しています。

Issue を提出する前に、関連する Issue が既に存在しないか確認してください。

Issue を作成する際は、必ず Issue テンプレートに記入してください。特に、[最小限の再現手順](https://stackoverflow.com/help/minimal-reproducible-example)はバグ修正に非常に重要で、より迅速なトリアージに直接つながります。

## プルリクエスト

[PR による貢献](https://github.com/kintone/cli-kintone/pulls)を行う場合は、まず対応する Issue が存在することを確認してください。
また、実装を開始する前に Issue で提案することをお勧めします。

## 開発

### リポジトリのセットアップ

[Node.js](https://nodejs.org/) が設定されている必要があります。

リポジトリをクローンして移動します

```shell
git clone git@github.com:kintone/cli-kintone.git
cd cli-kintone
```

依存関係をインストールします

```shell
corepack enable
pnpm install
```

リポジトリが準備できているか確認するため、ビルドコマンドを実行します。

```shell
pnpm build
```

### ビルド

現在、npm パッケージと実行可能ファイルで異なるビルドプロセスを使用しています。

両方をビルドするには、`build:all` コマンドを実行します:

```shell
pnpm build:all
```

#### npm パッケージのビルド

`build` コマンドを実行します:

```shell
pnpm build
```

ウォッチモードでビルドするには、`start` コマンドを実行します:

```shell
pnpm start
```

動作を確認するには、エントリーポイントファイルを直接実行します:

```shell
./cli.js
```

#### 実行可能ファイルのビルド

`build:artifacts` コマンドを実行します:

```shell
pnpm build:artifacts
```

実行可能ファイルは `bin` ディレクトリに生成されます。

```
bin
├── cli-kintone-linux-x64
├── cli-kintone-macos-arm64
└── cli-kintone-win-x64.exe
```

### テスト

ユニットテストと E2E テストの2種類のテストがあります。
[Allure Report](https://allurereport.org/) によって生成された[テストレポート](https://kintone.github.io/cli-kintone/index.html)を確認できます。

#### ユニットテスト

実装を変更する場合、対応するユニットテストを追加または更新する必要があります。

ユニットテストは、テスト対象のコードの隣の `__tests__` ディレクトリにあります。

ユニットテストの書き方については、[Jest](https://jestjs.io/) のドキュメントをお読みください。

`test` コマンドを使用してユニットテストを実行できます:

```shell
pnpm test
```

:::note
CI でもテストを実行するため、ローカル実行はオプションです。
:::

#### E2E テスト

E2E テストは実用的なシナリオに基づいています。[Cucumber](https://github.com/cucumber/cucumber-js) を使用しています。

すべての E2E テストは、リポジトリルートの [`features`](https://github.com/kintone/cli-kintone/tree/main/features) ディレクトリにあります。

`test:e2e` コマンドを使用して E2E テストを実行できます:

```shell
pnpm test:e2e
```

残念ながら、E2E テストを実行するには API アクセス権を持つ実際の kintone 環境が必要です。
そのため、CI での実行を推奨します。

##### 並列実行

E2E テストは、テスト実行を高速化するためにデフォルトで並列実行されます。デフォルト設定では、最大10個のテストが同時に実行されます。

場合によっては、テストを順次実行したい場合があります。たとえば、複数のテストが同じリソース（特定の kintone アプリなど）を共有する場合、競合を避けるために同時に実行すべきではありません。

特定のシナリオを順次実行するには、リソース識別子を付けた `@serial` タグを使用します:

```gherkin
@serial(app_in_space_for_export)
Scenario: App in a space
  Given The app "app_in_space_for_export" has no records
  ...
```

同じ `@serial(resource)` タグを持つシナリオは、互いに同時実行されません。ただし、異なる `@serial` タグを持つシナリオや `@serial` タグを持たないシナリオとは並列実行できます。

**既存の E2E テストで使用されているリソース識別子の例:**

| リソース識別子               | 説明                                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app_for_export`             | レコードエクスポート機能をテストするための汎用アプリ                                                                   |
| `app_for_import`             | レコードインポート機能をテストするための汎用アプリ                                                                     |
| `app_for_export_attachments` | ファイルダウンロード機能をテストするための添付ファイルフィールドを持つアプリ                                           |
| `app_for_export_table`       | テーブルデータのエクスポートをテストするためのテーブルフィールドを持つアプリ                                           |
| `app_in_space_for_export`    | スペース関連機能をテストするための kintone スペースに配置されたアプリ                                                  |
| `app_in_guest_space`         | ゲストスペースアクセスをテストするためのゲストスペースに配置されたアプリ                                               |
| `plugin_<plugin_id>`         | プラグインのアップロード/更新機能をテストするためのプラグインリソース（例: `plugin_chjjmgadianhfiopehkbjlfkfioglafk`） |

同じリソースで動作する複数のテストシナリオは、並列テスト実行中の競合状態を防ぐために同じ `@serial` タグを使用する必要があります。

Cucumber での並列実行の詳細については、[公式ドキュメント](https://github.com/cucumber/cucumber-js/blob/main/docs/parallel.md)を参照してください。

### ドキュメントウェブサイト

ドキュメントウェブサイト（このウェブサイト！）は同じ PR で更新する必要があります。

ドキュメントを更新するには、[`website/docs`](https://github.com/kintone/cli-kintone/tree/main/website/docs) のファイルを編集してください。

ローカルで変更をプレビューするには、`doc:start` コマンドを実行します:

```shell
pnpm doc:start
```

### Linting

作業をコミットする前に、`lint` コマンドを実行してください:

```shell
pnpm lint
```

`fix` コマンドで自動修正を実行できます:

```shell
pnpm fix
```

### 安定性

機能の安定性を示すために[安定性指標](./stability-index.md)を定義しています。

実験的/非推奨の機能については、ドキュメントに[注釈](https://docusaurus.io/docs/markdown-features/admonitions)を追加し、CLI で警告を表示してください。

#### 注釈

注釈を追加するには、`experimental` または `deprecated` 注釈タイプを使用します。

```markdown
:::experimental[Title]

Body

:::
```

:::experimental[Title]

Body

:::

```markdown
:::deprecated[Title]

Body

:::
```

:::deprecated[Title]

Body

:::

#### CLI 警告

CLI で警告を表示するには、ヘルパー関数を使用します。

```typescript
emitExperimentalWarning("This feature is under early development.");
```

```typescript
emitDeprecationWarning(
  "This feature has been deprecated.\nUse new option instead.",
);
```

### コミット

コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う必要があります。

```
<type>: <description>
```

以下のコミットタイプをサポートしています:

| Type     | 説明                  |
| -------- | --------------------- |
| feat     | 新機能                |
| fix      | バグ修正              |
| test     | テスト更新            |
| build    | ビルドプロセスの変更  |
| ci       | CI ワークフローの変更 |
| docs     | ドキュメント更新      |
| perf     | パフォーマンス改善    |
| refactor | リファクタリング      |
| revert   | 過去の変更の取り消し  |
| lint     | Lint 更新             |
| style    | スタイル更新          |
| debug    | デバッグ              |
| chore    | その他の雑務          |

:::warning
`debug` コミットを `main` ブランチにマージしないでください。
:::

後方互換性を変更するコミットの場合は、**Breaking Change** としてマークしてください。

- スコープの直後に `!` を追加
- `BREAKING CHANGE: <description>` フッターを追加
  - 説明は、ユーザーへの影響を簡潔かつ明確に要約する必要があります。

### プルリクエストの作成

すべての準備が整ったら、[GitHub でプルリクエスト](https://github.com/kintone/cli-kintone/pulls)を作成してください。

PR タイトルも [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う必要があります。
タイトルは、マージ時の squash コミットのコミットメッセージとして使用されます。
また、[CHANGELOG](https://github.com/kintone/cli-kintone/blob/main/CHANGELOG.md) でも使用されるため、ユーザーにとって理解しやすいものにしてください。

最後に、テンプレートに従って PR の本文を記入することを忘れないでください。

### リリース

[Release Please](https://github.com/googleapis/release-please) を使用してリリースを作成し、CHANGELOG を更新しています。

[Release PR](https://github.com/kintone/cli-kintone/pulls?q=is%3Apr+is%3Aopen+label%3A%22autorelease%3A+pending%22) をマージすると、リリースがトリガーされます。
マージする前に CHANGELOG とリリースバージョンを確認してください。

#### リリース頻度

通常、メンテナーは週次でリリースをトリガーします。

#### バージョニング

[セマンティック バージョニング](https://semver.org/) に従っています。

詳細については、[バージョニングポリシー](./versioning.md) ページを参照してください。
