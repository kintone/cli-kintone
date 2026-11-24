---
applyTo: "src/**/*.ts"
---

# TypeScript review rules — `src/**`

Apply in addition to `.github/copilot-instructions.md`.

## Types

- Prefer types from `@kintone/rest-api-client` for kintone records, fields, app schemas, and API responses. Do not re-declare equivalent shapes locally — re-declaration drifts from the SDK on every update. Import from the top-level package; do not reach into internal subpaths.

  ```ts
  // ✗ ad-hoc shape that drifts from the SDK
  type Record = { $id: { value: string }; [k: string]: { value: unknown } };

  // ✓ reuse SDK types via the public entry point
  import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
  import { KintoneRestAPIError } from "@kintone/rest-api-client";
  ```

- Flag new `any`, `as any`, `as unknown as`, `@ts-ignore`, `@ts-expect-error` without an inline justification.
- Prefer `unknown` over `any` at boundaries (parsed JSON, file content), then narrow with a type guard.
- Use discriminated unions for command results instead of optional fields that are "always set together".

## Errors

- Command handlers in `src/cli/**` must not throw raw `Error`. Wrap with a typed error class (see `src/record/error/`) so the CLI can emit a useful exit code and message.
- `catch (e)` must narrow before use:

  ```ts
  // ✓
  } catch (e) {
    if (e instanceof KintoneRestAPIError) { ... }
    throw e;
  }
  ```

- Error messages must not contain API tokens, passwords, or `Authorization` headers, even when re-throwing.

## Async & I/O

- All new I/O should be `async` with `node:fs/promises`. Flag `*Sync` calls outside of startup / scripts.
- Prefer `Promise.all` for independent calls. Flag accidental sequential `await` in loops over independent items.

## CLI options (`src/cli/**`)

- Option names are kebab-case (`--api-token`, `--app-id`, `--base-url`). Camel-case option names are wrong.
- Reuse shared builders from `src/cli/authOptions/`, `src/cli/connectionOptions.ts`, `src/cli/logOption.ts` instead of redeclaring `--base-url`, `--username`, `--password`, `--api-token`, `--basic-auth-*`, `--proxy`.
- New flags need a description suitable for `--help` and corresponding docs in `website/docs/reference/`.

## Imports & boundaries

- Use `import type { ... }` for type-only imports.
- No deep imports across feature boundaries (e.g. files under `src/record/` should not import private submodules of `src/customize/`). Use the feature's public entry (`src/<feature>/index.ts` style) or lift the shared code into `src/utils/` / `src/kintone/`.
- Domain logic does not live in `src/cli/**`. That layer wires yargs and delegates; logic lives in `src/{record,customize,plugin,kintone}/`.
