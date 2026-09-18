---
title: Sandbox
unlisted: true
---

# Sandbox

:::experimental[Sandbox support]

This feature is still under active development and is not part of the public interface yet.
Field names, validation rules, and command output may change without notice.

:::

kintone can run a plugin or a JavaScript and CSS customization in a sandbox. Code that runs in a sandbox uses only the permissions and the hosts that are declared for it, and kintone blocks anything else.

Both declarations live in a manifest file, and cli-kintone reads them from there. The two manifests are separate files with separate commands, so they are documented separately.

| Page                                            | Manifest                  | Commands                                                |
| ----------------------------------------------- | ------------------------- | ------------------------------------------------------- |
| [Plugin sandbox](./plugin-sandbox.md)           | `manifest.json`           | `plugin pack`, `plugin info`, `plugin upload`           |
| [Customization sandbox](./customize-sandbox.md) | `customize-manifest.json` | `customize init`, `customize export`, `customize apply` |

The two manifests spell the settings differently. A plugin manifest carries a `sandbox` flag and allows a `scope` on each permission; a customize manifest has neither. The declarations themselves are not shared: a plugin and a customization on the same app each declare their own.
