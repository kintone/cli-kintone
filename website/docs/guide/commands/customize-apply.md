---
sidebar_position: 1320
---

# customize apply

The `customize apply` command allows you to apply customize settings from a manifest file to a kintone app.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone customize apply \
  --input customize-manifest.json \
  --app 123 \
  --base-url https://example.cybozu.com \
  --username admin \
  --password password
```

## Options

See [Options](/guide/options) page for common options.

| Option    | Required | Default | Description                                |
| --------- | -------- | ------- | ------------------------------------------ |
| `--input` | Yes      |         | The input path of manifest file.           |
| `--app`   | Yes      |         | The app ID to apply customize settings to. |
| `--yes`   |          |         | Answer "Yes" to all prompts.               |

## Behavior

- A confirmation prompt will be shown before applying (default: No)
- Relative paths in the manifest file are resolved relative to the manifest file location
- Only password authentication is supported

## Manifest File

See [customize init](./customize-init.md) for manifest file specification.
