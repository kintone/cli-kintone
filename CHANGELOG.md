# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

See https://developer.cybozu.io/hc/ja/articles/10663181361689 for more details.
