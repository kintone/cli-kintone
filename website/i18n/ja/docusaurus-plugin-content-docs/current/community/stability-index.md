---
sidebar_position: 300
---

# 安定性指標

このページでは、cli-kintone の機能の安定性を示す方法について説明します。

## 基本

基本的に、cli-kintone は後方互換性を維持し、[バージョニングポリシー](./versioning.md)に従いますが、開発中または削除される可能性のある機能も含まれています。

cli-kintone 機能の安定性を示すために**安定性指標**を使用しています。
安定（stable）、実験的（experimental）、非推奨（deprecated）の3つの指標があります。

## 安定（Stable）

デフォルトでは、機能はこの指標に分類されます。

変更は[バージョニングポリシー](./versioning.md)に従ってバージョンに反映されます。

## 実験的（Experimental）

これは不安定な機能の指標です。

変更は[バージョニングポリシー](./versioning.md)の対象外です。破壊的変更や削除が発生する可能性があります。
本番環境での使用は推奨されません。

ドキュメントでは、機能は**実験的**注釈で説明されています。

:::experimental[Title]

This feature is still under active development.

:::

:::experimental[Title]

Enabling this feature will destructively change the behavior of the command.
To enable this feature, use the `--experimental-feature-name` flag.

:::

この指標の機能は、実行時に WARN レベルのログを出力します。

```shell
[2024-10-22T05:39:44.494Z] WARN: [Experimental] This feature is under early development.
```

既存の動作を壊さないために CLI フラグが必要になる場合があります。

```shell
cli-kintone --experimental-feature-name
```

## 非推奨（Deprecated）

これは、将来の更新で削除される可能性のある非推奨の機能の指標です。
バグ修正やセキュリティ更新を含め、この指標の機能はメンテナンスされません。

ドキュメントでは、機能は**非推奨**注釈で説明されています。

:::deprecated[Title (since X.Y.Z)]
:::

:::deprecated[Title (since X.Y.Z)]

Use \<alternative feature> instead.

:::

この指標の機能は、実行時に WARN レベルのログを出力します。

```shell
[2024-10-22T05:39:44.495Z] WARN: [Deprecated] This feature has been deprecated.
[2024-10-22T05:39:44.495Z] WARN: Use <alternative feature> instead.
```
