# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.0](https://github.com/kintone/cli-kintone/compare/v1.2.0...v1.3.0) (2023-02-21)


### Features

* delete records command ([#230](https://github.com/kintone/cli-kintone/issues/230)) ([aaaf4b0](https://github.com/kintone/cli-kintone/commit/aaaf4b01d2dc133322d43c18b7bacf2dd78050e8))
* improve memory usage of record import ([#218](https://github.com/kintone/cli-kintone/issues/218)) ([c38aa94](https://github.com/kintone/cli-kintone/commit/c38aa94e966b5a6e9117f5405703c5edbee72bd1))


### Bug Fixes

* catch the stream error ([#225](https://github.com/kintone/cli-kintone/issues/225)) ([cb4d46a](https://github.com/kintone/cli-kintone/commit/cb4d46aa875031e6b09dfd5ee5e033bf6072f13c))
* **deps:** update dependency @kintone/rest-api-client to ^3.2.2 ([#181](https://github.com/kintone/cli-kintone/issues/181)) ([78fbcb2](https://github.com/kintone/cli-kintone/commit/78fbcb2c97609634928c9e8d08d0f62e1d9e38fe))
* **deps:** update dependency @kintone/rest-api-client to ^3.2.3 ([#195](https://github.com/kintone/cli-kintone/issues/195)) ([4c8e4af](https://github.com/kintone/cli-kintone/commit/4c8e4af7cf05a937ab127e0ead4049eb1dd55c4a))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.0 ([#205](https://github.com/kintone/cli-kintone/issues/205)) ([b951e9e](https://github.com/kintone/cli-kintone/commit/b951e9ec8db8e021ef83e0c8cbddc4ece9eef024))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.1 ([#215](https://github.com/kintone/cli-kintone/issues/215)) ([b5e42e7](https://github.com/kintone/cli-kintone/commit/b5e42e754cd81bb90ec7893ade4a3e2f5f6dbeac))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.2 ([#229](https://github.com/kintone/cli-kintone/issues/229)) ([1d4d6c6](https://github.com/kintone/cli-kintone/commit/1d4d6c6b466b6c475ff50e4f52ed0cb864fd1fe5))

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
