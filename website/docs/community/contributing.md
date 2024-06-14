---
sidebar_position: 200
---

# Contributing

We always welcome your contribution! This document provides how to contribute to cli-kintone.

## Code of Conduct

Before starting contribution, please see [Code of Conduct](https://github.com/kintone/.github/blob/main/docs/CODE_OF_CONDUCT.md) first.

## Supporting resources

If you have any questions or feedbacks, you can check our [supporting resources](/community).

## Issues

We use [GitHub Issues](https://github.com/kintone/cli-kintone/issues) for bug reports and feature requests.

Before submitting an Issue, please make sure that there is no related Issue already.

When creating an Issue, be sure to fill out the Issue template. Especially, a [minimum reproduction](https://stackoverflow.com/help/minimal-reproducible-example) is really important to fix a bug and directly lead to faster triage.

## Pull Requests

If you are going to make a [PR contribution](https://github.com/kintone/cli-kintone/pulls), please make sure that a corresponding Issue exist first.
In addition, we encourage you to make a proposal in the Issue before starting implementation.

## Development

### Setup repository

[Node.js](https://nodejs.org/) should be configured.

Clone and move into the repository

```shell
git clone git@github.com:kintone/cli-kintone.git
cd cli-kintone
```

Install dependencies

```shell
corepack enable
pnpm install
```

Run build command to check if the repository is ready.

```shell
pnpm build
```

### Build

Run `build` command:

```shell
pnpm build
```

Executables will be generated in `bin` directory.

```
bin
├── cli-kintone-linux
├── cli-kintone-macos
└── cli-kintone-win.exe
```

To build in watch mode, run `start` command:

```shell
pnpm start
```

In watch mode, only JavaScript output in `dist` directory are updated. So run the entrypoint file directly.

```shell
node ./cli.js
```

### Testing

We have two kinds of tests, unit tests and E2E tests.

#### Unit tests

When you change implementation, corresponding unit tests must be added or updated.

Unit tests are located in the `__tests__` directory next to the test target code.

Please read [Jest](https://jestjs.io/) document to know how to write unit tests.

You can run unit tests using `test` command:

```shell
pnpm test
```

:::note
We also run tests on CI, so local execution is optional.
:::

#### E2E tests

E2E testing is based on practical scenarios. We use [Cucumber](https://github.com/cucumber/cucumber-js).

All of our E2E tests are located in [`features`](https://github.com/kintone/cli-kintone/tree/main/features) directory of repository root.

You can run E2E tests using `test:e2e` command:

```shell
pnpm test:e2e
```

Unfortunately, an actual kintone environment with API access is required to run E2E tests.
Therefore, we recommend to run on CI.

### Documentation website

The documentation website (this website!) must be updated in the same PR.

Edit files in [`website/docs`](https://github.com/kintone/cli-kintone/tree/main/website/docs) to update documents.

To preview changes on local, run `doc:start` command:

```shell
pnpm doc:start
```

### Linting

Before commit your work, please run `lint` command:

```shell
pnpm lint
```

You can run auto-fix with `fix` command:

```shell
pnpm fix
```

### Commit

The commit message must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>: <description>
```

We support the following commit types:

| Type     | Description              |
| -------- | ------------------------ |
| feat     | New features             |
| fix      | Bug fixes                |
| test     | Test updates             |
| build    | Changes on build process |
| ci       | Changes on CI workflows  |
| docs     | Document updates         |
| perf     | Performance improvements |
| refactor | Refactoring              |
| revert   | Reverting past changes   |
| lint     | Lint updates             |
| style    | Style updates            |
| debug    | Debugs                   |
| chore    | Any other chores         |

:::warning
Must not merge `debug` commit to the `main` branch.
:::

If the commit will change the backward compatibility, please mark the commit as a **Breaking Change**.

- Add `!` just after the scope
- Add `BREAKING CHANGE: <description>` footer
  - The description should be a short clear summary of user impact.

### Creating a Pull Request

When everything is ready, make a [Pull Request on GitHub](https://github.com/kintone/cli-kintone/pulls).

The PR title must also follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
The title will be used as the commit message of squash commit on merging.
It will also be used on [CHANGELOG](https://github.com/kintone/cli-kintone/blob/main/CHANGELOG.md), so make sure to be understandable for users.

Finally, don't forget to fill out the PR body following the template.

### Releasing

We use [Release Please](https://github.com/googleapis/release-please) to create a release and update CHANGELOG.

Merging a [Release PR](https://github.com/kintone/cli-kintone/pulls?q=is%3Apr+is%3Aopen+label%3A%22autorelease%3A+pending%22) will trigger the release.
Please check CHANGELOG and release version before merge.

#### Release frequency

Normally, maintainer will trigger a release weekly.

#### Versioning

We follow the [Semantic Versioning](https://semver.org/).

For more details, see [Versioning Policy](./versioning) page.
