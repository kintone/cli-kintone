# Plugin Templates

This directory contains plugin templates used by the `cli-kintone plugin init` command.

## Available Templates

- **javascript**: JavaScript-based plugin template
- **typescript**: TypeScript-based plugin template (using webpack)

## Adding a New Template

> [!NOTE]
> Only npm is supported as the package manager. Other package managers (pnpm, yarn) are not supported

### Location

```
plugin-templates/{template-name}/
```

The template name must match the value specified with the `--template` option.

### Required Files

#### 1. manifest.json

A valid kintone plugin manifest file.
For detailed specifications, please refer to:

https://kintone.dev/en/plugins/introduction-to-plug-ins/plug-in-development-specifications/

**Required fields:**

```json
{
  "manifest_version": 1,
  "version": 1,
  "type": "APP",
  "name": {
    "en": "Plugin name"
  },
  "icon": "image/icon.png"
}
```

**Note:** The following fields will be overwritten by user input:

- `name` (ja, en, zh, es)
- `description` (same as above)
- `homepage_url` (same as above)

#### 2. package.json

A valid package.json file. `scripts.keygen` and `scripts.build` are required:

```json
{
  "name": "template-name",
  "version": "0.1.0",
  "scripts": {
    "keygen": "cli-kintone plugin keygen --output private.ppk",
    "build": "cli-kintone plugin pack --private-key private.ppk --output dist/plugin.zip --input manifest.json"
  },
  "devDependencies": {
    "@kintone/cli": "^1.14.3"
  }
}
```

**Required scripts:**

- `keygen`: Generate a private key `private.ppk` for plugin signing
- `build`: Package the plugin after running `npm install` and `npm run keygen`

**Note:**

- The `name` field will be overwritten by the package name specified by the user
- The `@kintone/cli` version must be [v1.15.0](https://github.com/kintone/cli-kintone/releases/tag/v1.15.0) or higher

## References

- [Kintone Plugin Specifications](https://kintone.dev/en/plugins/introduction-to-plug-ins/plug-in-development-specifications/)
- [Kintone Plugin Developer Guide](https://kintone.dev/en/plugins/)
