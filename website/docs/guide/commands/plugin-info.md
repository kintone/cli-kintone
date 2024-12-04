---
sidebar_position: 1100
---

# plugin info

The `plugin info` command allows you to see information of the plugin zip file.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone plugin info --input ./plugin.zip
```

## Options

See [Options](/guide/options) page for common options.

| Option       | Required | Description                                                           |
| ------------ | -------- | --------------------------------------------------------------------- |
| `--input`    | Yes      | The input plugin zip file path.                                       |
| `--format  ` |          | Output format.<br/>Format: `plain` or `json`.<br/>Default to `plain`. |
