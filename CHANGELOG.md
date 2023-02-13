# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.0](https://github.com/kintone/cli-kintone/compare/v1.1.0...v1.2.0) (2022-11-29)


### Features

* providing subcommand for command completion ([#158](https://github.com/kintone/cli-kintone/issues/158)) ([0b183d1](https://github.com/kintone/cli-kintone/commit/0b183d149fa435d1131f78824183079121f8f5bb))


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.2.1 ([#163](https://github.com/kintone/cli-kintone/issues/163)) ([549cb19](https://github.com/kintone/cli-kintone/commit/549cb19ae1eeef3ee0eb5e9f98da618ee01ce085))
* the output of command completion is displayed incorrectly ([#169](https://github.com/kintone/cli-kintone/issues/169)) ([b44a99e](https://github.com/kintone/cli-kintone/commit/b44a99ef3d4b5c5b265a3e13bbb0fb0a70b2eb9c))

## [1.1.0](https://github.com/kintone/cli-kintone/compare/v1.0.1...v1.1.0) (2022-11-10)


### Features

* add fieldCode into the error message ([#147](https://github.com/kintone/cli-kintone/issues/147)) ([6ac16cb](https://github.com/kintone/cli-kintone/commit/6ac16cb1b2e16c3ef3bb444becc351e24bb89ffe))


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.2.0 ([#144](https://github.com/kintone/cli-kintone/issues/144)) ([a65cc73](https://github.com/kintone/cli-kintone/commit/a65cc737c5cf3adfc082d52b652736461d333309))
* **deps:** update dependency yargs to ^17.6.1 ([#145](https://github.com/kintone/cli-kintone/issues/145)) ([cd16757](https://github.com/kintone/cli-kintone/commit/cd167570a71d8d015911a30de462aaf9993206e0))
* **deps:** update dependency yargs to ^17.6.2 ([#148](https://github.com/kintone/cli-kintone/issues/148)) ([680df84](https://github.com/kintone/cli-kintone/commit/680df84d488e88ff388feae99902975909bb0267))

## [1.0.1](https://github.com/kintone/cli-kintone/compare/v1.0.0...v1.0.1) (2022-10-28)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.1.16 ([#136](https://github.com/kintone/cli-kintone/issues/136)) ([0692c0b](https://github.com/kintone/cli-kintone/commit/0692c0bc8eaf4c57c50c6922f922551e2b886a23))
* send request over HTTP tunneling ([#139](https://github.com/kintone/cli-kintone/issues/139)) ([54a1ac9](https://github.com/kintone/cli-kintone/commit/54a1ac929cb295573d587f1d8f749e1c9101400b))

## 1.0.0 (2022-10-24)

cli-kintone is a CLI tool to import/export records to/from kintone.

This tool has the following big updates from https://github.com/kintone-labs/cli-kintone.
- Support upserting records
- Support a Record number as "Key to Bulk Update" instead of Record ID (`$id`).
- Support client certificate authentication

See https://cybozu.dev/ja/kintone/sdk/backup/cli-kintone for more details.
