---
sidebar_position: 1300
---

# customize init

The `customize init` command allows you to initialize a new customize manifest file.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone customize init \
  --output customize-manifest.json
```

## Options

See [Options](/guide/options) page for common options.

| Option     | Required | Default                   | Description                       |
| ---------- | -------- | ------------------------- | --------------------------------- |
| `--output` |          | `customize-manifest.json` | The output path of manifest file. |
| `--yes`    |          |                           | Answer "Yes" to all prompts.      |

## Interactive Prompts

When you run `customize init`, you will be prompted to enter the following information:

1. Scope (ALL, ADMIN, NONE) - Default: `ALL`
2. Confirmation for overwriting if the file already exists
