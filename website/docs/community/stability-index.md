---
sidebar_position: 300
---

# Stability Index

This page describes how we indicate the stability of cli-kintone features.

## Basics

Basically, cli-kintone maintains backward compatibility and follows the [Versioning Policy](./versioning) but also includes features that are under development or will be removed.

We use the Stability Index to indicate the stability of cli-kintone features.
There are three indexes: stable, experimental, and deprecated.

## Stable

By default, features are categorized in this index.

Changes are reflected in the version according to the [Versioning Policy](./versioning).

## Experimental

This is an index for underdevelopment and unstable features.

Changes are not subject to the [Versioning Policy](./versioning). Breaking changes or removal may occur.
Production use is not recommended.

In the documentation, features are described with **Experimental** [admonitions](https://docusaurus.io/docs/markdown-features/admonitions).

:::experimental[Title]

This feature is still under active development.

:::

:::experimental[Title]

Enabling this feature will destructively change the behavior of the command.  
To enable this feature, use the `--experimental-feature-name` flag.

:::

Features in this index emit a WARN level log on execution.

```shell
[2024-10-22T05:39:44.494Z] WARN: [Experimental] This feature is under early development.
```

CLI flag may be needed to avoid breaking existing behavior.

```shell
cli-kintone --experimental-feature-name
```

## Deprecated

This is an index for deprecated features that can be removed in future updates.
We don't maintain features in this index, including bug fixes and security updates.

In the documentation, features are described with **Deprecated** [admonitions](https://docusaurus.io/docs/markdown-features/admonitions).

:::deprecated[Title (since X.Y.Z)]
:::

:::deprecated[Title (since X.Y.Z)]

Use \<alternative feature> instead.

:::

Features in this index emit a WARN level log on execution.

```shell
[2024-10-22T05:39:44.495Z] WARN: [Deprecated] This feature has been deprecated.
[2024-10-22T05:39:44.495Z] WARN: Use <alternative feature> instead.
```
