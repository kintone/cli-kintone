---
title: Plugin sandbox
unlisted: true
---

# Plugin sandbox

:::experimental[Plugin sandbox support]

This feature is still under active development and is not part of the public interface yet.
Field names, validation rules, and command output may change without notice.

:::

cli-kintone recognizes three optional fields in `manifest.json` (Manifest v1) that declare a plugin's sandbox policy: `sandbox`, `allowed_hosts`, and `permissions`. When these fields are present, `plugin pack` validates them, `plugin info` surfaces them in its output, and `plugin upload` includes them in the installation summary.

## Fields

| Field           | Type                                       | Description                                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sandbox`       | `boolean`                                  | Whether the plugin is sandbox-aware.                                                                                                                                                                                                                                                                                                                              |
| `allowed_hosts` | `string[]`                                 | List of allowed network endpoints. Each entry is either a URI with a scheme (e.g. `https://example.com`, `wss://example.com/ws/*`) or the bare wildcard `"*"`. cli-kintone only checks the structural form; domain-specific rules (IP literal rejection, trailing-slash-only rejection, cybozu domain exclusion, etc.) are enforced by kintone itself at runtime. |
| `permissions`   | `{ permission: string; scope?: string }[]` | API permissions the plugin requests. Each entry has a required `permission` and an optional `scope`. The `permission` / `scope` vocabulary is still under design and is not constrained by the schema yet.                                                                                                                                                        |

When `sandbox` is set to `true`, both `allowed_hosts` and `permissions` are required. When `sandbox` is absent or set to `false`, `allowed_hosts` and `permissions` remain optional.

## Example manifest

```json
{
  "manifest_version": 1,
  "version": 1,
  "type": "APP",
  "name": { "en": "sandbox-sample" },
  "icon": "image/icon.png",
  "sandbox": true,
  "allowed_hosts": ["https://example.com", "wss://example.com/ws/*"],
  "permissions": [
    { "permission": "app:read" },
    { "permission": "network:connect" },
    { "permission": "app_record:read", "scope": "self" }
  ]
}
```

## Command behavior

### `plugin pack`

Validates the three fields against the manifest schema before packaging. Validation errors abort packaging with a non-zero exit code; otherwise the plugin zip is produced as usual.

### `plugin info`

When any of `sandbox` / `allowed_hosts` / `permissions` is defined in the manifest, `plugin info` prints all three sandbox-related lines (`sandbox`, `allowed_hosts`, `permissions`). Sandbox-unaware plugins (none of the three fields defined) omit the block entirely. Each permission is rendered as `permission[:scope]`, and the entries are joined with commas.

- `(not set)` — the field is absent from the manifest.
- `(none)` — the field is declared as an explicitly empty array.

Example plain output:

```text
sandbox: true
allowed_hosts: https://example.com, wss://example.com/ws/*
permissions: app:read, network:connect, app_record:read:self
```

In JSON format, keys that are absent from the manifest are omitted from the output. Sandbox-related keys mirror the manifest naming (`sandbox`, `allowed_hosts`, `permissions`) rather than the camelCase accessor names used by the library internals.

### `plugin upload`

When any of `sandbox` / `allowed_hosts` / `permissions` is defined in the manifest, the installation summary prints all three sandbox-related lines together (`Sandbox`, `Allowed hosts`, `Permissions`). Sandbox-unaware plugins show no additional lines. The same `(not set)` / `(none)` placeholders as `plugin info` are used. Example:

```text
  Installation Summary:
    Destination: https://example.cybozu.com
    ...
    Target version: 1
    Sandbox: true
    Allowed hosts: https://example.com, wss://example.com/ws/*
    Permissions: app:read, network:connect, app_record:read:self
```
