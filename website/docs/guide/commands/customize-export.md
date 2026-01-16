---
sidebar_position: 500
---

# customize export

The `customize export` command allows you to export JavaScript/CSS customization settings from a Kintone app.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone customize export \
  --base-url https://${yourDomain} \
  --app ${appId} \
  --username ${username} \
  --password ${password} \
  --output customize-manifest.json
```

## Options

See [Options](/guide/options) page for common options.

| Option     | Required | Description                                                                |
| ---------- | -------- | -------------------------------------------------------------------------- |
| `--app`    | Yes      | The ID of the app                                                          |
| `--output` |          | Output path for the manifest file<br/>Default to `customize-manifest.json` |
| `--yes`    |          | Skip confirmation                                                          |

## Output

Downloaded JS/CSS files are saved to directories relative to the manifest file:

```
{manifest-dir}/
├── customize-manifest.json
├── desktop/
│   ├── js/
│   └── css/
└── mobile/
    ├── js/
    └── css/
```

The generated manifest file contains:

- URLs for CDN resources (preserved as-is)
- Relative paths for downloaded files (e.g., `desktop/js/app.js`)
