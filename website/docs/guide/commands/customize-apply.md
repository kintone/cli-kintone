---
sidebar_position: 600
---

# customize apply

The `customize apply` command allows you to apply JavaScript/CSS customization to a Kintone app from a manifest file.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone customize apply \
  --base-url https://${yourDomain} \
  --app ${appId} \
  --username ${username} \
  --password ${password} \
  --input customize-manifest.json
```

## Options

See [Options](/guide/options) page for common options.

| Option    | Required | Description               |
| --------- | -------- | ------------------------- |
| `--app`   | Yes      | The ID of the app         |
| `--input` | Yes      | Path to the manifest file |
| `--yes`   |          | Skip confirmation         |

## Notes

- File paths in the manifest are resolved relative to the manifest file location.
- Both local files and URLs (e.g., CDN) can be specified in the manifest.
