---
sidebar_position: 1600
---

# plugin upload

The `plugin upload` command allows you to upload a plugin to a kintone environment.

:::experimental

This feature is under early development.

:::

**Notice**

- This command only supports password authentication.

## Example

```shell
cli-kintone plugin upload --input ./plugin.zip \
  --base-url https://${yourDomain} \
  --username ${yourUsername} \
  --password ${yourPassword}
```

## Options

See [Options](/guide/options) page for common options.

| Option          | Required | Description                     |
| --------------- | -------- | ------------------------------- |
| `--input`, `-i` | Yes      | The input plugin zip file path. |
| `--yes`, `-y`   |          | Skip confirmation.              |
| `--watch`       |          | Run in watch mode.              |
