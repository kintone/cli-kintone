---
sidebar_position: 400
---

# customize init

The `customize init` command allows you to initialize a manifest file for JavaScript/CSS customization.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone customize init --output customize-manifest.json
```

## Options

See [Options](/guide/options) page for common options.

| Option     | Required | Description                                                                |
| ---------- | -------- | -------------------------------------------------------------------------- |
| `--output` |          | Output path for the manifest file<br/>Default to `customize-manifest.json` |
| `--yes`    |          | Skip confirmation                                                          |

## Manifest File

The manifest file is a JSON file with the following structure:

| Property      | Type                             | Description                |
| ------------- | -------------------------------- | -------------------------- |
| `scope`       | `"ALL"` \| `"ADMIN"` \| `"NONE"` | Customization scope        |
| `desktop.js`  | `string[]`                       | JS files for desktop view  |
| `desktop.css` | `string[]`                       | CSS files for desktop view |
| `mobile.js`   | `string[]`                       | JS files for mobile view   |
| `mobile.css`  | `string[]`                       | CSS files for mobile view  |

### Example

```json
{
  "scope": "ALL",
  "desktop": {
    "js": [
      "https://js.cybozu.com/jquery/3.3.1/jquery.min.js",
      "desktop/js/app.js"
    ],
    "css": ["desktop/css/style.css"]
  },
  "mobile": {
    "js": [],
    "css": []
  }
}
```
