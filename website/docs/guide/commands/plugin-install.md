---
sidebar_position: 1600
---

# plugin install

Installs a plugin to a kintone environment.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone plugin install --input ./plugin.zip
```

## Options

See [Options](/guide/options) page for common options.

| Option          | Required | Description                     |
| --------------- | -------- | ------------------------------- |
| `--input`       | Yes      | The input plugin zip file path. |
| `--yes  `, `-y` |          | Skip confirmation.              |
| `--watch  `     |          | Run in watch mode.              |
