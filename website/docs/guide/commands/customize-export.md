---
sidebar_position: 1310
---

# customize export

The `customize export` command allows you to export customize settings from a kintone app to a manifest file.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone customize export \
  --app 123 \
  --output customize-manifest.json \
  --base-url https://example.cybozu.com \
  --username admin \
  --password password
```

## Options

See [Options](/guide/options) page for common options.

| Option     | Required | Default                   | Description                                   |
| ---------- | -------- | ------------------------- | --------------------------------------------- |
| `--app`    | Yes      |                           | The app ID to export customize settings from. |
| `--output` |          | `customize-manifest.json` | The output path of manifest file.             |
| `--yes`    |          |                           | Answer "Yes" to all prompts.                  |

## Behavior

- Downloaded JS/CSS files are saved to `$(dirname $MANIFEST_PATH)/{js,css}/`
- If the manifest file already exists, a confirmation prompt will be shown (default: No)
- Only password authentication is supported
