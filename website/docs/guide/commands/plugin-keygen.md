---
sidebar_position: 1300
---

# plugin keygen

The `plugin keygen` command generates private key for a plugin.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone plugin keygen --output private.ppk
```

## Options

See [Options](/guide/options) page for common options.

| Option     | Required | Description                                                       |
| ---------- | -------- | ----------------------------------------------------------------- |
| `--output` |          | The output private key file path. Default to `./${plugin_id}.ppk` |
