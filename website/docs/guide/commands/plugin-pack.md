---
sidebar_position: 1400
---

# plugin pack

The `plugin pack` command allows you to packaging kintone plugin project.

## Example

```shell
cli-kintone plugin pack \
  --input ./src/manifest.json \
  --output ./dist/plugin.zip \
  --private-key ./key.ppk
```

## Options

See [Options](/guide/options) page for common options.

| Option           | Required | Description                                                                                                                         |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `--input`, `-i`  | Yes      | The input plugin manifest file path.                                                                                                |
| `--output`, `-o` |          | The destination file path to generate plugin zip file.<br/>Default to `./plugin.zip`.                                               |
| `--private-key`  | Yes      | The path of private key file. If you don't have a private key, you can generate with [`plugin keygen`](./plugin-keygen.md) command. |
| `--watch`        |          | Run in watch mode.                                                                                                                  |
