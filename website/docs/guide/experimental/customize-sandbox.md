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

| Property        | Type                       | Description                                             |
| --------------- | -------------------------- | ------------------------------------------------------- |
| `permissions`   | `{ permission: string }[]` | Permissions the customization is allowed to use.        |
| `allowed_hosts` | `string[]`                 | Hosts the customization is allowed to communicate with. |

Each `permission` is a namespaced identifier such as `kintone:app_record:read`. Unlike a plugin manifest, an entry takes no `scope`, and there is no `sandbox` flag on the manifest.

Each entry of `allowed_hosts` needs a scheme and must not contain a path, such as `https://example.com` or `https://*.cybozu.com`. A wildcard entry and a specific host can both be listed.

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
  "allowed_hosts": ["https://example.com", "https://*.cybozu.com"]
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

These are two different requests, so a manifest that should keep the current permissions leaves the property out rather than repeating what `customize export` wrote.

`customize apply` fails when the manifest has either property and the kintone environment does not support these settings.

## Using the same manifest with customize-uploader

cli-kintone reads every manifest that [customize-uploader](../migration/migration-from-js-sdk.md) accepts. The opposite is not true: these two properties are specific to cli-kintone.

customize-uploader forwards every manifest property to the Update Customization API as it is, so a manifest that carries `permissions` fails with customize-uploader on an environment that does not support these settings. Leave both properties out of a manifest that customize-uploader also reads.
