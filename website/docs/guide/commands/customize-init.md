---
sidebar_position: 400
---

# customize init

The `customize init` command allows you to initialize a manifest file for JavaScript/CSS customization.

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

| Property        | Type                             | Description                                                                           |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| `scope`         | `"ALL"` \| `"ADMIN"` \| `"NONE"` | Customization scope                                                                   |
| `desktop.js`    | `string[]`                       | JS files for desktop view                                                             |
| `desktop.css`   | `string[]`                       | CSS files for desktop view                                                            |
| `mobile.js`     | `string[]`                       | JS files for mobile view                                                              |
| `mobile.css`    | `string[]`                       | CSS files for mobile view                                                             |
| `permissions`   | `{ permission: string }[]`       | Permissions granted to the customization when the Secure Option is used               |
| `allowed_hosts` | `string[]`                       | Hosts the customization is allowed to communicate with when the Secure Option is used |

`permissions` and `allowed_hosts` behave differently from the other properties.
Leaving them out keeps the current settings on the app, while an empty array clears them.
`customize init` does not generate them, and `customize export` writes them only when the app has any.

Both properties require the app to have the Secure Option turned on. `customize apply` fails if the manifest has them and the app does not. Turn the Secure Option on from the app settings screen first.

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
