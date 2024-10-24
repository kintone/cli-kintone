---
sidebar_position: 500
draft: true
---

# plugin pack

The `plugin` command allows you to packaging kintone plugin project.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone plugin pack \
  --input ./src \
  --output ./dist \
  --private-key ./key.ppk
```

## Options

See [Options](/guide/options) page for common options.

| Option            | Required | Description                                                                                    |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `--input`         | Yes      | The input plugin project directory.                                                            |
| `--output`        |          | The destination path of generated plugin file.<br/>Default to plugin.zip on current directory. |
| `--private-key  ` |          | The path of private key file<br/>If omitted, new private key will be generated.                |
