# cli-kintone

Official CLI for kintone. Bundles record / customize / plugin subcommands and ships as a Node.js package plus standalone executables (Linux x64, macOS arm64, Windows x64) produced via `ncc` + Node SEA (`pkg`).

For the documentation site (Docusaurus), see [`website/CLAUDE.md`](./website/CLAUDE.md).

## Repository layout

```
src/
├── cli/                # Entry points and yargs command wiring (main.ts is the entry)
│   ├── record/         # `cli-kintone record ...`
│   ├── customize/      # `cli-kintone customize ...`
│   ├── plugin/         # `cli-kintone plugin ...`
│   ├── authOptions/    # Shared --base-url / --username / --password / --api-token / --basic-auth-... flags
│   └── connectionOptions.ts, logOption.ts, stability.ts
├── record/             # Record import/export/delete domain logic
├── customize/          # JS customize apply/export/init logic
├── plugin/             # Plugin pack / upload / keygen / info logic
├── kintone/            # kintone API client wrappers (built on @kintone/rest-api-client)
└── utils/

features/               # Cucumber E2E (step_definitions/, supports/, plugin/, customize/, record/)
scripts/                # Build helpers (compress-to-zip-file.ts, update-contributors.ts)
plugin-templates/       # Scaffolding emitted by `cli-kintone plugin init`
website/                # Docusaurus docs (see website/CLAUDE.md)
.github/                # Workflows, PR template, Copilot review instructions
```

Unit tests live next to source as `__tests__/` directories using vitest.

## Toolchain

- Node `>=20` (`mise.toml` pins Node 24 for development)
- Package manager: **pnpm** (`packageManager: pnpm@10.30.3`).
- Bundler: `@vercel/ncc` for single-file build, `pkg` (Node SEA) for native executables
- Linter / formatter: ESLint (`eslint.config.mjs`) + Prettier (`*.{json,md,yml,yaml}`)
- Tests: vitest (unit) + Cucumber (E2E, `features/`)
- Release: release-please with **Conventional Commits** (see `release-please-config.json`)

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm build` | Clean `lib/` then `tsc --build tsconfig.build.json` |
| `pnpm start` | `build` in watch mode |
| `pnpm build:all` | Build + native executables + license analysis + zip |
| `pnpm typecheck` | `tsc --noEmit` against `tsconfig.typecheck.json` |
| `pnpm test` | vitest (unit) |
| `pnpm test:ci` | vitest with CI config |
| `pnpm test:e2e` | Cucumber E2E. Requires kintone credentials via env (see `features/supports/`) |
| `pnpm test:e2e:dev` | `test:e2e --fail-fast` |
| `pnpm lint` | `lint:eslint` + `lint:prettier` in parallel |
| `pnpm fix` | Auto-fix eslint + prettier |
| `pnpm doc:*` | Delegate to `website/` workspace |
| `./cli.js` | Run the locally built CLI |

Before submitting a change, run: `pnpm lint && pnpm typecheck && pnpm test`.

## Testing policy

- **Unit (vitest)**: colocated in `src/**/__tests__/`. Default to real implementations; mock only at external boundaries (HTTP, fs, kintone API).
- **E2E (Cucumber)**: lives in `features/`. Step definitions in `features/step_definitions/`. Each subcommand has its own subfolder. E2E runs against a real kintone environment using credentials from `e2e-credentials-schema.json`-shaped env vars; do not commit credentials.
- Add a vitest test when changing domain logic in `src/{record,customize,plugin,kintone}/`. Add or update a feature file when changing user-visible CLI behavior.

## Cross-repo dependencies

- Depends on `@kintone/rest-api-client` from `kintone/js-sdk`. When the SDK ships a breaking change, bump here and verify against `pnpm test:e2e`.
- Public docs live in `website/` and at <https://cli.kintone.dev/>.

## AI agent files

- `CLAUDE.md` (this file): implementation context for Claude.
- `website/CLAUDE.md`: Docusaurus-specific guidance for the docs workspace.
- `.github/copilot-instructions.md`: repo-wide review rules for GitHub Copilot. Single source of truth for review-time rules.
- `.github/instructions/*.instructions.md`: path-scoped Copilot review rules (`applyTo` frontmatter).
- `.claude/rules/*.md`: Claude-side path-scoped rule loaders. Each file declares `paths:` frontmatter and `@import`s the matching Copilot file so Claude follows the same rules without duplicating content. The Copilot files under `.github/` are the canonical source — edit them, not the loaders.
