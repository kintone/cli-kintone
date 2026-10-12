---
applyTo: "src/**/__tests__/**,features/**"
---

# Test review rules — vitest unit tests & Cucumber E2E

Apply in addition to `.github/copilot-instructions.md`.

## Layering

- vitest — colocated as `src/**/__tests__/*.test.ts`. Use for unit / integration of pure logic, parsers, formatters, and feature modules in `src/{record,customize,plugin,kintone}/`.
- Cucumber — `features/`. Use for user-visible CLI behavior: option parsing, exit codes, stdout / stderr format, file I/O against a real kintone environment.
- A behavior change that affects what the user sees on the command line needs a `features/` update, not only a vitest test.

## What to flag in vitest

- Mocking the unit under test, mocking pure functions, or asserting on mock call counts when the public output already encodes the behavior.

  ```ts
  // ✗ over-mocked: asserts on the mock, not the behavior
  const fn = vi.fn();
  myCommand({ logger: fn });
  expect(fn).toHaveBeenCalledWith("done");

  // ✓ assert on the observable result
  const result = await myCommand({ ... });
  expect(result.status).toBe("ok");
  ```

- Wide `vi.mock("module")` calls when a narrow stub on the dependency would do.
- Snapshots of large objects without a clear reason — prefer field-level assertions.
- Tests that pass by mocking the kintone API to return exactly what the code expects without exercising any branch.
- Skipped (`.skip`) or focused (`.only`) tests left in the diff.

## What to flag in Cucumber (`features/`)

- New scenarios that hard-code credentials, real kintone subdomains, or app IDs. Use the env-driven setup in `features/supports/` (credentials loaded via env vars per `e2e-credentials-schema.json`).
- Step definitions that reach into internal modules in `src/`. Steps should drive the CLI as a black box (spawn the binary, assert stdout / stderr / exit code / file outputs).
- Background steps duplicated across scenarios that could be lifted to `Background:` blocks.

## Common to both

- Tests must not write outside their tmp dir, leak network calls in unit tests, or depend on test ordering.
- Failure messages should identify what was being verified, not just `expected true to be false`.
- New domain logic in `src/{record,customize,plugin}/` needs at least one vitest test; new CLI-visible behavior needs a `features/` scenario. Flag missing coverage.
