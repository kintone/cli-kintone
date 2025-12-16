---
sidebar_position: 1500
unlisted: true
---

# plugin check

The `plugin check` command allows you to check JavaScript files in a kintone plugin for potential issues, such as the use of internal/unsupported APIs.

:::experimental

This feature is under early development.

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

### no-cybozu-data

Detects access to `cybozu.data`, which is an internal and unsupported API that may change without notice.

**Example of detected code:**

```javascript
// ❌ Not allowed
console.log(cybozu.data);
const data = cybozu.data;
cybozu.data.foo();
```

### no-kintone-internal-selector

Detects the use of kintone's internal CSS class names that may change without notice. This includes patterns like:

- `gaia-argoui-*` (e.g., `gaia-argoui-button`)
- `*-gaia` (e.g., `button-gaia`)
- `ocean-*` (e.g., `ocean-ui-button`)
- `kintone-*` (e.g., `kintone-dialog`)

**Example of detected code:**

```javascript
// ❌ Not allowed
document.querySelector(".gaia-argoui-button");
document.querySelectorAll(".ocean-ui-dialog");
element.closest(".kintone-dialog");
document.getElementsByClassName("button-gaia");

// Also detected in string literals (e.g., jQuery)
$(".gaia-argoui-button").click();
```

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
