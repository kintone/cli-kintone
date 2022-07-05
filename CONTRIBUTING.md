# Contributing Guide

## For Contributors

Contributions are always welcome!
If you have discovered a bug or have a feature request, [please create an issue on GitHub](https://github.com/kintone/cli-kintone/issues/new/choose).
Pull requests are also welcome when you find trivial bugs or typos.

We use English for all commit messages, code comments, issues, pull requests.
For Japanese speakers, we have another repository: https://github.com/kintone/js-sdk-ja.
Please file an issue there.

(Translated in Japanese)
本リポジトリではコミットメッセージやコードコメント、issues、pull requests において英語を使用しています。
日本語話者向けに専用のリポジトリも用意しています: https://github.com/kintone/js-sdk-ja
こちらに issue をご登録ください。

### Setup

```sh
% cd cli-kintone
% yarn install
```

### Develop

```sh
% cd cli-kintone
% yarn start
```

### Test

Before run `lint` and `test` scripts, you have to run `build`.

```sh
% cd cli-kintone
% yarn build
% yarn test
% yarn lint
```

## For Maintainers

### Merge

After you have approved a PR, please merge the PR using **Squash and merge** with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.

```sh
feat: support importing CSV
```

### Release

TODO: Create release pipeline and write document
