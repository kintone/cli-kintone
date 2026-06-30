# Copilot review instructions — cli-kintone

cli-kintone is the official kintone CLI (TypeScript, Node `>=20`, pnpm), **public OSS** under `kintone/`. Review PRs in this priority order. TS-specific and test-specific rules live in `.github/instructions/*.instructions.md`.

## Correctness

- Flag missing handling for rate-limit responses (HTTP 429). Surface a typed error and exit non-zero; do not swallow-and-retry forever.
- Flag generic "request failed" error messages that don't tell the user what to do. Map auth, not-found, and validation failures to actionable messages.
- Flag boundary / off-by-one bugs in pagination, batching, CSV / JSON row handling.

## Security

- Flag code that logs, prints, or returns API tokens, passwords, `Authorization` headers, basic-auth credentials, or session cookies. Redact before stdout / stderr / logs / error messages / thrown errors.
- Flag credentials, hostnames, customer data, or internal information committed to source, tests, fixtures, snapshots, or `features/`. Repo is public.
- Flag `child_process.exec` / shell concatenation from user input. Use `spawn` with argv.
- Flag path traversal: user-supplied paths must be normalized within the expected base.
- Flag disabled TLS (`rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`) without an explicit user-facing flag.

## Code quality

- Flag hard-coded `/` in user-facing paths; use `path.join` / `path.resolve` (Windows is supported).
- Flag unused exports, dead code, `console.log` in non-CLI paths.
- Flag a new runtime dependency without justification in the PR description (`pkg` is sensitive to bundle size / native modules).

## Tests

- Behavior changes in `src/{record,customize,plugin,kintone}/` need a vitest test in the colocated `__tests__/`.
- User-visible CLI behavior needs a Cucumber feature / step update under `features/`.
- Flag tests that mock the unit under test, mock pure functions, or assert on mock-internal calls instead of observable behavior.
- Flag committed credentials or real kintone hostnames in fixtures.

## PRs

- PRs must fill in `.github/PULL_REQUEST_TEMPLATE.md` (Why / What / How to test / Checklist).

## Review style

- Concrete: cite file and line, name the risk, suggest the change. Avoid vague "consider improving readability".
- State **observed** impact ("breaks CSV import on BOM"), not a hypothetical edge case.
- Scope to the diff. Refactor ideas on surrounding code go in `suggestion:` only.
- Comment in English. Do not block on issues already enforced by ESLint / Prettier in CI.
- Use one of these prefixes (default = no prefix = blocking):
  - **(no prefix)** — blocking. Bugs, security, type or test failures, public-OSS hygiene breaks. Must be addressed before merge.
  - **`nit:`** — non-blocking polish (style, typo, naming). Author can ignore.
  - **`question:`** — clarification of intent. May become blocking depending on the answer.
  - **`suggestion:`** — non-blocking improvement, alternative, or refactor idea on surrounding code.
- Provide a GitHub-flavored `suggestion` code block when a concrete fix exists; `question:` needs none.
