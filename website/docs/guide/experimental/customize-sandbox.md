---
title: Customization sandbox
unlisted: true
---

# Customization sandbox

:::experimental[Customization sandbox support]

This feature is still under active development and is not part of the public interface yet.
Field names, validation rules, and command output may change without notice.

:::

A JavaScript and CSS customization that runs in a [sandbox](./sandbox.md) uses only the permissions and the hosts that the app declares for it. The app settings screen edits the same pair of settings.

cli-kintone recognizes two optional properties in `customize-manifest.json` that carry these settings: `permissions` and `allowed_hosts`. `customize export` writes them, and `customize apply` sends them.

## Properties

| Property        | Type                                       | Description                                             |
| --------------- | ------------------------------------------ | ------------------------------------------------------- |
| `permissions`   | `{ permission: string, scope?: string }[]` | Permissions the customization is allowed to use.        |
| `allowed_hosts` | `string[]`                                 | Hosts the customization is allowed to communicate with. |

Each `permission` is a namespaced identifier such as `kintone:app_record:read`. An entry takes the same shape as a plugin manifest's, so a set of permissions can be moved between the two. kintone ignores `scope` for a customization, and `customize export` does not write it back. There is no `sandbox` flag on the manifest.

Each entry of `allowed_hosts` needs a scheme and must not contain a path, such as `https://example.com` or `https://*.example.com`. A wildcard entry and a specific host can both be listed.

## Example manifest

```json
{
  "scope": "ALL",
  "desktop": {
    "js": ["desktop/js/app.js"],
    "css": []
  },
  "mobile": {
    "js": [],
    "css": []
  },
  "permissions": [{ "permission": "kintone:app_record:read" }],
  "allowed_hosts": ["https://example.com", "https://*.example.com"]
}
```

## Command behavior

### `customize init`

Generates neither property. A manifest produced by `customize init` leaves both settings on the app untouched when it is applied.

### `customize export`

Writes each property only when the app has values for it. A manifest for an app that uses neither gains nothing.

This means an exported manifest does not clear these settings on another app. Applying it to a second app leaves that app's permissions and allowed hosts as they are.

### `customize apply`

Sends each property only when the manifest has it.

- The property is absent — the setting on the app is left unchanged.
- The property is an empty array — the setting on the app is cleared.

`customize apply` fails when the manifest has either property and the kintone environment does not support these settings.

`customize apply` warns about each property of the manifest that it does not recognize, and then ignores it.

A manifest whose `permissions` or `allowed_hosts` has a type other than the one above fails before any file is uploaded.
