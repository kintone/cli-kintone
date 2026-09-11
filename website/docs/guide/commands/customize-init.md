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

:::experimental[Secure Option settings]

`permissions` and `allowed_hosts` are still under active development.
The permission vocabulary and the validation rules may change without notice.

:::

The Secure Option is an app setting that runs the customization in a sandbox.
Once it is on, the customization can use only the permissions and the hosts that the app declares.

Leaving `permissions` or `allowed_hosts` out of the manifest keeps the current settings on the app,
and an empty array clears them.
`customize init` does not generate either property,
and `customize export` writes them only when the app has any.

Each entry of `allowed_hosts` must specify a scheme and must not contain a path,
such as `https://example.com` or `https://*.cybozu.com`.
Each `permission` is a namespaced identifier such as `kintone:app_record:read`.
The available permissions and host formats are the same as the ones for plugins.

Both properties require the app to have the Secure Option turned on.
`customize apply` fails if the manifest has them and the app does not.
Turn the Secure Option on from the app settings screen first.

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
