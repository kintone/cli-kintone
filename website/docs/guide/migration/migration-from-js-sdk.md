---
sidebar_position: 100
---

# Migrate from js-sdk

This guide helps you migrate from the Kintone js-sdk plugin tools to cli-kintone plugin commands.

## Overview

The Kintone js-sdk provides several npm packages for plugin development:

- [@kintone/create-plugin](https://www.npmjs.com/package/@kintone/create-plugin) - Create plugin templates
- [@kintone/plugin-packer](https://www.npmjs.com/package/@kintone/plugin-packer) - Package plugins into zip files
- [@kintone/plugin-uploader](https://www.npmjs.com/package/@kintone/plugin-uploader) - Upload plugins to Kintone

cli-kintone consolidates these tools into a single CLI with unified plugin commands.

## Tool Comparison

| js-sdk Tool | cli-kintone Command | Description |
| --- | --- | --- |
| @kintone/create-plugin | [plugin init](../commands/plugin-init.md) | Initialize a new plugin project |
| @kintone/plugin-packer | [plugin pack](../commands/plugin-pack.md) | Package plugin into zip file |
| @kintone/plugin-uploader | [plugin upload](../commands/plugin-upload.md) | Upload plugin to Kintone |
| - | [plugin keygen](../commands/plugin-keygen.md) | Generate private key for plugin |
| - | [plugin info](../commands/plugin-info.md) | Display plugin information |

## Migration Steps

### 1. Install cli-kintone

First, install cli-kintone globally or locally in your project. See [Installation](../installation.md) for details.

```shell
npm install @kintone/cli --global
```

### 2. Update Your Workflow

#### Creating a New Plugin

**Before (js-sdk):**

```shell
npm init @kintone/plugin
```

**After (cli-kintone):**

```shell
cli-kintone plugin init --name my-plugin --template javascript
```

#### Generating Private Key

With js-sdk, the private key is automatically generated during the first build. With cli-kintone, you can explicitly generate it:

```shell
cli-kintone plugin keygen --output private.ppk
```

#### Packaging Plugin

**Before (js-sdk):**

```shell
kintone-plugin-packer --ppk private.ppk --out plugin.zip src/
```

**After (cli-kintone):**

```shell
cli-kintone plugin pack --input ./src --output ./plugin.zip --private-key ./private.ppk
```

**Watch mode:**

```shell
cli-kintone plugin pack --input ./src --output ./plugin.zip --private-key ./private.ppk --watch
```

#### Uploading Plugin

**Before (js-sdk):**

```shell
kintone-plugin-uploader --base-url https://example.cybozu.com --username admin --password password plugin.zip
```

**After (cli-kintone):**

```shell
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password
```

**Watch mode:**

```shell
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password --watch
```

#### Viewing Plugin Information

cli-kintone provides an additional command to view plugin information:

```shell
cli-kintone plugin info --input ./plugin.zip --format json
```

### 3. Update package.json Scripts

If you have npm scripts using js-sdk tools, update them to use cli-kintone:

**Before (js-sdk):**

```json
{
  "scripts": {
    "start": "kintone-plugin-packer --ppk private.ppk --watch src/",
    "build": "kintone-plugin-packer --ppk private.ppk src/",
    "upload": "kintone-plugin-uploader --base-url https://example.cybozu.com --username admin --password password plugin.zip"
  }
}
```

**After (cli-kintone):**

```json
{
  "scripts": {
    "start": "cli-kintone plugin pack --input ./src --private-key ./private.ppk --watch",
    "build": "cli-kintone plugin pack --input ./src --private-key ./private.ppk",
    "upload": "cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password"
  }
}
```

### 4. Uninstall js-sdk Tools (Optional)

Once you've migrated to cli-kintone, you can remove the js-sdk tools:

```shell
npm uninstall @kintone/create-plugin @kintone/plugin-packer @kintone/plugin-uploader
```

## Key Differences

### Command Structure

- **js-sdk:** Each tool is a separate npm package with its own command
- **cli-kintone:** All plugin commands are under the `cli-kintone plugin` namespace

### Option Names

Some option names differ between the tools:

| Feature | js-sdk | cli-kintone |
| --- | --- | --- |
| Input directory/file | Positional argument | `--input`, `-i` |
| Output file | `--out` | `--output`, `-o` |
| Private key file | `--ppk` | `--private-key` |

### Additional Features

cli-kintone provides features not available in js-sdk:

- **plugin keygen:** Explicitly generate private keys
- **plugin info:** View plugin metadata without uploading
- **Unified authentication:** Common authentication options across all commands

## Benefits of Migration

- **Single tool:** One CLI for all plugin development tasks
- **Consistent interface:** Unified command structure and options
- **Better integration:** Works seamlessly with cli-kintone record commands
- **Active development:** cli-kintone is actively maintained and receives regular updates

## Need Help?

If you encounter issues during migration:

- Check the [plugin commands documentation](../commands/plugin-init.md)
- Review the [troubleshooting guide](../troubleshooting.md)
- Report issues at [GitHub Issues](https://github.com/kintone/cli-kintone/issues)

## Sources

- [@kintone/plugin-packer - npm](https://www.npmjs.com/package/@kintone/plugin-packer)
- [@kintone/plugin-uploader - npm](https://www.npmjs.com/package/@kintone/plugin-uploader)
- [@kintone/create-plugin - npm](https://www.npmjs.com/package/@kintone/create-plugin)
- [Kintone js-sdk GitHub Repository](https://github.com/kintone/js-sdk)
