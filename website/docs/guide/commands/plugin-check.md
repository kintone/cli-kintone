---
sidebar_position: 1500
unlisted: true
---

# plugin check

The `plugin check` command allows you to check JavaScript files in a kintone plugin for potential issues, such as the use of internal/unsupported APIs.

:::experimental

This feature is under early development.

:::

:::note

This command is only available when installed via npm (`npx @kintone/cli` or `npm install -g @kintone/cli`).
It is not available in the binary version.

:::

## Example

```shell
# Check a plugin zip file
cli-kintone plugin check --input ./plugin.zip

# Check a plugin project by specifying manifest.json
cli-kintone plugin check --input ./src/manifest.json

# Output results in JSON format
cli-kintone plugin check --input ./plugin.zip --format json
```

## Options

See [Options](/guide/options) page for common options.

| Option          | Required | Description                                                           |
| --------------- | -------- | --------------------------------------------------------------------- |
| `--input`, `-i` | Yes      | The input plugin zip file or manifest.json file path.                 |
| `--format`      |          | Output format.<br/>Format: `plain` or `json`.<br/>Default to `plain`. |

## Checked Rules

The `plugin check` command runs the following checks on JavaScript files in the plugin:

| Rule                                                                                                                                                                              | Description                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [no-cybozu-data](https://github.com/kintone/js-sdk/blob/230a964e0800412003d46effbbda3cc31f72501c/packages/eslint-plugin/docs/rules/no-cybozu-data.md)                             | Detects access to `cybozu.data`, which is an internal and unsupported API. |
| [no-kintone-internal-selector](https://github.com/kintone/js-sdk/blob/230a964e0800412003d46effbbda3cc31f72501c/packages/eslint-plugin/docs/rules/no-kintone-internal-selector.md) | Detects the use of kintone's internal CSS class names.                     |

## Output Format

### Plain Format (Default)

```
js/script.js
  42:7    error    Accessing `cybozu.data` is not allowed.  (local/no-cybozu-data)

Files checked: 3
Problems: 1 (Errors: 1, Warnings: 0)
```

### JSON Format

```json
{
  "errorCount": 1,
  "warningCount": 0,
  "filesChecked": 3,
  "filesSkipped": 1,
  "files": [
    {
      "filePath": "js/script.js",
      "messages": [
        {
          "ruleId": "local/no-cybozu-data",
          "severity": 2,
          "message": "Accessing `cybozu.data` is not allowed.",
          "line": 42,
          "column": 7
        }
      ],
      "errorCount": 1,
      "warningCount": 0
    }
  ]
}
```
