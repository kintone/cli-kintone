---
sidebar_position: 100
unlisted: true
---

# Migrate from js-sdk

This guide helps you migrate from the [kintone/js-sdk](https://github.com/kintone/js-sdk) plugin development tools to cli-kintone.

## Overview

kintone/js-sdk provides several npm packages for plugin development:

- [@kintone/create-plugin](https://www.npmjs.com/package/@kintone/create-plugin) - Create plugin templates
- [@kintone/plugin-packer](https://www.npmjs.com/package/@kintone/plugin-packer) - Package plugins into zip files
- [@kintone/plugin-uploader](https://www.npmjs.com/package/@kintone/plugin-uploader) - Upload plugins to kintone

cli-kintone consolidates these tools into a single CLI with unified plugin commands.

## Why Migrate to cli-kintone?

Migrating from kintone/js-sdk to [cli-kintone](https://github.com/kintone/cli-kintone) offers several benefits:

### Consolidated Setup and Learning Costs

With kintone/js-sdk, plugin development features were distributed across multiple npm packages (@kintone/create-plugin, @kintone/plugin-packer, @kintone/plugin-uploader). Each package required separate installation, and developers needed to learn different commands and options for each tool.

cli-kintone consolidates all these capabilities into a single CLI. By installing just one tool, you can perform all operations from plugin creation to upload, significantly reducing the learning curve. Additionally, it adopts a consistent command structure and option naming under the unified `cli-kintone plugin` namespace.

### Improved Interface and Behavior

cli-kintone incorporates improvements based on feedback from kintone/js-sdk usage:

- **Explicit Private Key Management**: Private key generation is separated into a dedicated `plugin keygen` command, making key management more explicit and clear
- **Extended Watch Mode**: The `--watch` option is now supported in both `plugin pack` and `plugin upload` commands, improving the development experience
- **Flexible Authentication**: In addition to password authentication, API token authentication is now supported
- **Consistent Option Design**: All commands adopt unified option names (such as `--input`, `--output`), making them more intuitive to use
- **Additional Features**: The `plugin info` command allows you to inspect plugin information without uploading

Furthermore, cli-kintone is actively maintained with regular feature additions and bug fixes.

## Tool Comparison

| js-sdk Tool              | cli-kintone Command                           | Description                                                                       |
| ------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------- |
| @kintone/create-plugin   | [plugin init](../commands/plugin-init.md)     | Initialize a new plugin project                                                   |
| @kintone/plugin-packer   | [plugin pack](../commands/plugin-pack.md)     | Package plugin into zip file<br/>※Private key generation moved to `plugin keygen` |
| @kintone/plugin-uploader | [plugin upload](../commands/plugin-upload.md) | Upload plugin to kintone environment                                              |
| -                        | [plugin keygen](../commands/plugin-keygen.md) | Generate private key for plugin                                                   |
| -                        | [plugin info](../commands/plugin-info.md)     | Display plugin information                                                        |

For detailed interface differences, see [Command-Specific Interface Differences](#command-specific-interface-differences) and [Key Differences](#key-differences).

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
cli-kintone plugin pack --input ./src/manifest.json --output ./plugin.zip --private-key ./private.ppk
```

**Watch mode:**

```shell
cli-kintone plugin pack --input ./src/manifest.json --output ./plugin.zip --private-key ./private.ppk --watch
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
    "start": "cli-kintone plugin pack --input ./src/manifest.json --private-key ./private.ppk --watch",
    "build": "cli-kintone plugin pack --input ./src/manifest.json --private-key ./private.ppk",
    "upload": "cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password"
  }
}
```

### 4. Uninstall js-sdk Tools (Optional)

Once you've migrated to cli-kintone, you can remove the js-sdk tools:

```shell
npm uninstall @kintone/create-plugin @kintone/plugin-packer @kintone/plugin-uploader
```

## Command-Specific Interface Differences

### plugin init (vs @kintone/create-plugin)

| Option           | js-sdk                | cli-kintone             | Notes                                                       |
| ---------------- | --------------------- | ----------------------- | ----------------------------------------------------------- |
| Plugin name      | Interactive prompt    | `--name <name>`         | cli-kintone supports non-interactive mode                   |
| Template         | Interactive selection | `--template <template>` | Choose from `javascript`, `typescript`, `modern`, `minimum` |
| Output directory | Current directory     | `--output <dir>`        | Defaults to current directory                               |

**Examples:**

```shell
# js-sdk (interactive)
npm init @kintone/plugin

# cli-kintone (non-interactive)
cli-kintone plugin init --name my-plugin --template javascript
```

### plugin pack (vs @kintone/plugin-packer)

| Option          | js-sdk              | cli-kintone                  | Notes                           |
| --------------- | ------------------- | ---------------------------- | ------------------------------- |
| Input directory | Positional argument | `--input <dir>`, `-i`        | Required                        |
| Output file     | `--out <file>`      | `--output <file>`, `-o`      | Defaults to `plugin.zip`        |
| Private key     | `--ppk <file>`      | `--private-key <file>`, `-p` | Auto-generated if not specified |
| Watch mode      | `--watch`           | `--watch`, `-w`              | Auto-repackage on file changes  |

**Examples:**

```shell
# js-sdk
kintone-plugin-packer --ppk private.ppk --out plugin.zip src/

# cli-kintone
cli-kintone plugin pack --input ./src/manifest.json --output ./plugin.zip --private-key ./private.ppk
```

### plugin upload (vs @kintone/plugin-uploader)

| Option     | js-sdk              | cli-kintone            | Notes                              |
| ---------- | ------------------- | ---------------------- | ---------------------------------- |
| Input file | Positional argument | `--input <file>`, `-i` | Required                           |
| Base URL   | `--base-url <url>`  | `--base-url <url>`     | kintone environment URL            |
| Username   | `--username <user>` | `--username <user>`    | For authentication                 |
| Password   | `--password <pass>` | `--password <pass>`    | For authentication                 |
| API token  | Not supported       | `--api-token <token>`  | API token authentication support   |
| Plugin ID  | Auto-detected       | `--plugin-id <id>`     | Specify for updates (omit for new) |
| Watch mode | Not supported       | `--watch`, `-w`        | Auto-upload on file changes        |

**Examples:**

```shell
# js-sdk
kintone-plugin-uploader --base-url https://example.cybozu.com --username admin --password password plugin.zip

# cli-kintone (password auth)
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --username admin --password password

# cli-kintone (API token auth)
cli-kintone plugin upload --input ./plugin.zip --base-url https://example.cybozu.com --api-token your-api-token
```

## Key Differences

### Command Structure

- **js-sdk:** Each tool is a separate npm package with its own command
- **cli-kintone:** All plugin commands are under the `cli-kintone plugin` namespace

### Option Names

Some option names differ between the tools:

| Feature              | js-sdk              | cli-kintone      |
| -------------------- | ------------------- | ---------------- |
| Input directory/file | Positional argument | `--input`, `-i`  |
| Output file          | `--out`             | `--output`, `-o` |
| Private key file     | `--ppk`             | `--private-key`  |

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
- [kintone/js-sdk GitHub Repository](https://github.com/kintone/js-sdk)
