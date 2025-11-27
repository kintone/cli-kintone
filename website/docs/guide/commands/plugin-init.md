---
sidebar_position: 1200
---

# plugin init

The `plugin init` command allows you to initialize a new kintone plugin project.

:::experimental

This feature is under early development.

:::

## Example

```shell
cli-kintone plugin init \\
  --name ${project_name} \\
  --template ${template_name}
```

## Options

See [Options](/guide/options) page for common options.

| Option       | Required | Description                                                                                                                 |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `--name`     |          | The project name and target directory.<br/>If a name is specified, the project will be created under the current directory. |
| `--template` |          | A template for the generated plugin.<br/>Default: `javascript`                                                              |

## Available Templates

| Template     | Description                      |
| ------------ | -------------------------------- |
| `javascript` | JavaScript-based plugin template |
| `typescript` | TypeScript-based plugin template |

See [plugin-templates](https://github.com/kintone/cli-kintone/tree/main/plugin-templates) for more details.

## Interactive Prompts

When you run `plugin init`, you will be prompted to enter the following information:

1. Project name (if `--name` is not specified)
2. Plugin name, description, and website URL for each supported language

## Supported Languages

- English (en) - Required
- Japanese (ja)
- Chinese (zh)
- Spanish (es)
