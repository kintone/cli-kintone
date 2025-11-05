---
sidebar_position: 1300
---

# plugin init

The `plugin init` command allows you to initialize a new plugin project.

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

| Option       | Required | Description                              |
| ------------ | -------- | ---------------------------------------- |
| `--name`     | Yes      | Project name                             |
| `--template` |          | Template type (javascript or typescript) |
