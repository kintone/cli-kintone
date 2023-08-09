# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0](https://github.com/kintone/cli-kintone/compare/v1.8.2...v1.0.0) (2023-08-09)


### Features

* add fieldCode into the error message ([#147](https://github.com/kintone/cli-kintone/issues/147)) ([6ac16cb](https://github.com/kintone/cli-kintone/commit/6ac16cb1b2e16c3ef3bb444becc351e24bb89ffe))
* auto-discover line break represents record delimiter ([#69](https://github.com/kintone/cli-kintone/issues/69)) ([e2edc44](https://github.com/kintone/cli-kintone/commit/e2edc44503b54e23ec7928ed119f287d333bf00f))
* bundle 3rd party license notations to artifacts ([#107](https://github.com/kintone/cli-kintone/issues/107)) ([9aeb960](https://github.com/kintone/cli-kintone/commit/9aeb960efeccc54275680afd10e777e533d70f0a))
* delete records command ([#230](https://github.com/kintone/cli-kintone/issues/230)) ([aaaf4b0](https://github.com/kintone/cli-kintone/commit/aaaf4b01d2dc133322d43c18b7bacf2dd78050e8))
* enable record import with a Record Number field ([#368](https://github.com/kintone/cli-kintone/issues/368)) ([ae4846e](https://github.com/kintone/cli-kintone/commit/ae4846e610d3d70c8c0052239d1d9597061b16c3))
* enable upsert with non-updatable fields ([#366](https://github.com/kintone/cli-kintone/issues/366)) ([0e5f1d2](https://github.com/kintone/cli-kintone/commit/0e5f1d2504b05b1e9370fe721999d943cb211f02))
* filter and sort fields by user input ([#41](https://github.com/kintone/cli-kintone/issues/41)) ([36ec322](https://github.com/kintone/cli-kintone/commit/36ec322b23da6c02ee2c1d94041ca526f96734f5))
* filter fields to be imported by user input ([#44](https://github.com/kintone/cli-kintone/issues/44)) ([815f30b](https://github.com/kintone/cli-kintone/commit/815f30b4974c0fbbd64ed5ff581032ba22de8ab0))
* improve memory usage of record export ([#311](https://github.com/kintone/cli-kintone/issues/311)) ([1c545c7](https://github.com/kintone/cli-kintone/commit/1c545c76cbfb4389ad8cd6972950a155eba834c3))
* improve memory usage of record import ([#218](https://github.com/kintone/cli-kintone/issues/218)) ([c38aa94](https://github.com/kintone/cli-kintone/commit/c38aa94e966b5a6e9117f5405703c5edbee72bd1))
* providing subcommand for command completion ([#158](https://github.com/kintone/cli-kintone/issues/158)) ([0b183d1](https://github.com/kintone/cli-kintone/commit/0b183d149fa435d1131f78824183079121f8f5bb))
* select character encoding when export ([#49](https://github.com/kintone/cli-kintone/issues/49)) ([597b4e6](https://github.com/kintone/cli-kintone/commit/597b4e663d9c41ef9992cfc496655b3b73f973e3))
* show progress log while importing ([#90](https://github.com/kintone/cli-kintone/issues/90)) ([f67ab14](https://github.com/kintone/cli-kintone/commit/f67ab14dff41d13d94e0bf7bb74c74824d083917))
* show user-friendly error log ([#78](https://github.com/kintone/cli-kintone/issues/78)) ([6191b8e](https://github.com/kintone/cli-kintone/commit/6191b8e0b2caacf6abc13c1a96c7a1103e6310aa))
* sort fields based on form layout when record export ([#31](https://github.com/kintone/cli-kintone/issues/31)) ([1178fbb](https://github.com/kintone/cli-kintone/commit/1178fbba9f2c3df5d91037562d7f417357e882bb))
* specifying socket timeout ([#410](https://github.com/kintone/cli-kintone/issues/410)) ([b2cdb29](https://github.com/kintone/cli-kintone/commit/b2cdb291b7d66d9320656bcfea71a3df47c69740))
* support proxy authentication ([#314](https://github.com/kintone/cli-kintone/issues/314)) ([6e69b3a](https://github.com/kintone/cli-kintone/commit/6e69b3ab246a06883105c359128455b1e0096cc1))
* support request over proxy ([#25](https://github.com/kintone/cli-kintone/issues/25)) ([a810d6d](https://github.com/kintone/cli-kintone/commit/a810d6d235ed3f55fbd7ebc20420c7710513ef56))
* upsert records by record number ([#60](https://github.com/kintone/cli-kintone/issues/60)) ([6bf7765](https://github.com/kintone/cli-kintone/commit/6bf7765165080895cfe794a9510eb2d335f57eea))
* upsert records sequentially ([#74](https://github.com/kintone/cli-kintone/issues/74)) ([7e9decb](https://github.com/kintone/cli-kintone/commit/7e9decb724a77a845def3823af0e7bb54e98554c))


### Bug Fixes

* `undefined` error message of the upsert command ([#376](https://github.com/kintone/cli-kintone/issues/376)) ([1f922ca](https://github.com/kintone/cli-kintone/commit/1f922cae93f97546466019840ac2a217ccbbc0bb))
* abolish JSON format ([#66](https://github.com/kintone/cli-kintone/issues/66)) ([52b7d72](https://github.com/kintone/cli-kintone/commit/52b7d721103663681ea0da3556e954d2cbbf0e61))
* allow Date field format is yyyy/mm/dd ([#390](https://github.com/kintone/cli-kintone/issues/390)) ([f9af100](https://github.com/kintone/cli-kintone/commit/f9af1005281955232c8ae7a067d4e834e9ee82a1))
* allow users to export an attachment with filename including a special character ([#358](https://github.com/kintone/cli-kintone/issues/358)) ([40a9c6f](https://github.com/kintone/cli-kintone/commit/40a9c6fa8eac7e923d566e3dfdd2eaebe020bea4))
* catch the stream error ([#225](https://github.com/kintone/cli-kintone/issues/225)) ([cb4d46a](https://github.com/kintone/cli-kintone/commit/cb4d46aa875031e6b09dfd5ee5e033bf6072f13c))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.10 ([#62](https://github.com/kintone/cli-kintone/issues/62)) ([e2391b1](https://github.com/kintone/cli-kintone/commit/e2391b12a1146ed2d26c1e9249c86389c139f431))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.11 ([#82](https://github.com/kintone/cli-kintone/issues/82)) ([931ebdd](https://github.com/kintone/cli-kintone/commit/931ebdd431ce699c507d67169460be8d8c07e4df))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.12 ([#99](https://github.com/kintone/cli-kintone/issues/99)) ([be139d3](https://github.com/kintone/cli-kintone/commit/be139d3af0ab73df5cedba81592cf7cd2296b261))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.14 ([#113](https://github.com/kintone/cli-kintone/issues/113)) ([9fd616a](https://github.com/kintone/cli-kintone/commit/9fd616a9e6d9ef6bcb58cb69f20302adea08d6ce))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.15 ([#125](https://github.com/kintone/cli-kintone/issues/125)) ([634ee88](https://github.com/kintone/cli-kintone/commit/634ee88796b8bea8b746f3d64b8d42d5dd244aaf))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.16 ([#136](https://github.com/kintone/cli-kintone/issues/136)) ([0692c0b](https://github.com/kintone/cli-kintone/commit/0692c0bc8eaf4c57c50c6922f922551e2b886a23))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.5 ([#15](https://github.com/kintone/cli-kintone/issues/15)) ([aeb0a10](https://github.com/kintone/cli-kintone/commit/aeb0a10c98eb30b182aff8c3782fa5ebb917d408))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.7 ([#26](https://github.com/kintone/cli-kintone/issues/26)) ([06029d2](https://github.com/kintone/cli-kintone/commit/06029d242bf7444a0360f0e1f19ddff828e82815))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.8 ([#38](https://github.com/kintone/cli-kintone/issues/38)) ([994d716](https://github.com/kintone/cli-kintone/commit/994d71607bd6b5bfd376186a2311731514e8dbef))
* **deps:** update dependency @kintone/rest-api-client to ^3.1.9 ([#48](https://github.com/kintone/cli-kintone/issues/48)) ([dee358a](https://github.com/kintone/cli-kintone/commit/dee358afe49595ba7c9d04d773c11843446f76a3))
* **deps:** update dependency @kintone/rest-api-client to ^3.2.0 ([#144](https://github.com/kintone/cli-kintone/issues/144)) ([a65cc73](https://github.com/kintone/cli-kintone/commit/a65cc737c5cf3adfc082d52b652736461d333309))
* **deps:** update dependency @kintone/rest-api-client to ^3.2.1 ([#163](https://github.com/kintone/cli-kintone/issues/163)) ([549cb19](https://github.com/kintone/cli-kintone/commit/549cb19ae1eeef3ee0eb5e9f98da618ee01ce085))
* **deps:** update dependency @kintone/rest-api-client to ^3.2.2 ([#181](https://github.com/kintone/cli-kintone/issues/181)) ([78fbcb2](https://github.com/kintone/cli-kintone/commit/78fbcb2c97609634928c9e8d08d0f62e1d9e38fe))
* **deps:** update dependency @kintone/rest-api-client to ^3.2.3 ([#195](https://github.com/kintone/cli-kintone/issues/195)) ([4c8e4af](https://github.com/kintone/cli-kintone/commit/4c8e4af7cf05a937ab127e0ead4049eb1dd55c4a))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.0 ([#205](https://github.com/kintone/cli-kintone/issues/205)) ([b951e9e](https://github.com/kintone/cli-kintone/commit/b951e9ec8db8e021ef83e0c8cbddc4ece9eef024))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.1 ([#215](https://github.com/kintone/cli-kintone/issues/215)) ([b5e42e7](https://github.com/kintone/cli-kintone/commit/b5e42e754cd81bb90ec7893ade4a3e2f5f6dbeac))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.10 ([#317](https://github.com/kintone/cli-kintone/issues/317)) ([09d9b92](https://github.com/kintone/cli-kintone/commit/09d9b92691f8c882fb0f6574ccd9f780f43286a9))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.11 ([#323](https://github.com/kintone/cli-kintone/issues/323)) ([8ae01f0](https://github.com/kintone/cli-kintone/commit/8ae01f0b689f2c45b42a3ccad66e16d90ca7b078))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.12 ([#338](https://github.com/kintone/cli-kintone/issues/338)) ([2234cb0](https://github.com/kintone/cli-kintone/commit/2234cb0537854790f5394f1cd8fef82289f0f228))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.13 ([#344](https://github.com/kintone/cli-kintone/issues/344)) ([9d9dd5a](https://github.com/kintone/cli-kintone/commit/9d9dd5a788677417d2104ac69c38fa7a7204e963))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.14 ([#350](https://github.com/kintone/cli-kintone/issues/350)) ([aa4ba94](https://github.com/kintone/cli-kintone/commit/aa4ba948f309d4059e465621a33fd09e6452361d))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.15 ([#359](https://github.com/kintone/cli-kintone/issues/359)) ([beaa913](https://github.com/kintone/cli-kintone/commit/beaa91384ac1b4dcc9d3f551f283b54431aeb7dc))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.2 ([#229](https://github.com/kintone/cli-kintone/issues/229)) ([1d4d6c6](https://github.com/kintone/cli-kintone/commit/1d4d6c6b466b6c475ff50e4f52ed0cb864fd1fe5))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.3 ([#261](https://github.com/kintone/cli-kintone/issues/261)) ([a11a430](https://github.com/kintone/cli-kintone/commit/a11a430a9cd1a8aa33ecd250639bc12619f3057e))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.4 ([#265](https://github.com/kintone/cli-kintone/issues/265)) ([35f2810](https://github.com/kintone/cli-kintone/commit/35f2810cff16ba5b77d2e031b450d469029aea8d))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.5 ([#275](https://github.com/kintone/cli-kintone/issues/275)) ([764f789](https://github.com/kintone/cli-kintone/commit/764f7898761c989e650b6e4075087e74ffdb3b06))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.6 ([#285](https://github.com/kintone/cli-kintone/issues/285)) ([9f7346b](https://github.com/kintone/cli-kintone/commit/9f7346b005086cd3f198ac0a185df24883ae74dc))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.7 ([#293](https://github.com/kintone/cli-kintone/issues/293)) ([bb9d366](https://github.com/kintone/cli-kintone/commit/bb9d3662c816f0a092816be84a6163563f27686a))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.8 ([#300](https://github.com/kintone/cli-kintone/issues/300)) ([c604709](https://github.com/kintone/cli-kintone/commit/c604709e06a01ee6861a11ceb3f68bbcb57a18d9))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.9 ([#304](https://github.com/kintone/cli-kintone/issues/304)) ([ca85cea](https://github.com/kintone/cli-kintone/commit/ca85ceadf80fc27e2305c7bb643f830911aa5a66))
* **deps:** update dependency @kintone/rest-api-client to ^4.1.0 ([#405](https://github.com/kintone/cli-kintone/issues/405)) ([6b8a390](https://github.com/kintone/cli-kintone/commit/6b8a3907f51ccba79b8266cb56a131856f9bcbd1))
* **deps:** update dependency @kintone/rest-api-client to v4 ([#369](https://github.com/kintone/cli-kintone/issues/369)) ([1bd600a](https://github.com/kintone/cli-kintone/commit/1bd600a5fd6d61dc0943258645174a3048b539ec))
* **deps:** update dependency csv-stringify to v5.6.5 ([#36](https://github.com/kintone/cli-kintone/issues/36)) ([095e097](https://github.com/kintone/cli-kintone/commit/095e0978cfa2217909e4043377f8e3bfd953f338))
* **deps:** update dependency inquirer to ^8.2.6 ([#422](https://github.com/kintone/cli-kintone/issues/422)) ([615a576](https://github.com/kintone/cli-kintone/commit/615a5761a9dd5680d823046e6cbf321b66455c76))
* **deps:** update dependency yargs to ^17.6.0 ([#105](https://github.com/kintone/cli-kintone/issues/105)) ([f0f88a9](https://github.com/kintone/cli-kintone/commit/f0f88a9fbc6326a14a678f949ca13728d490aa0c))
* **deps:** update dependency yargs to ^17.6.1 ([#145](https://github.com/kintone/cli-kintone/issues/145)) ([cd16757](https://github.com/kintone/cli-kintone/commit/cd167570a71d8d015911a30de462aaf9993206e0))
* **deps:** update dependency yargs to ^17.6.2 ([#148](https://github.com/kintone/cli-kintone/issues/148)) ([680df84](https://github.com/kintone/cli-kintone/commit/680df84d488e88ff388feae99902975909bb0267))
* **deps:** update dependency yargs to ^17.7.1 ([#231](https://github.com/kintone/cli-kintone/issues/231)) ([aa2737e](https://github.com/kintone/cli-kintone/commit/aa2737e7b38c650ebf2b003cc3ad49b357d14e7f))
* **deps:** update dependency yargs to ^17.7.2 ([#325](https://github.com/kintone/cli-kintone/issues/325)) ([4c0b59b](https://github.com/kintone/cli-kintone/commit/4c0b59bc94ba50d94836ad1bacdb38e5e440cab0))
* detection of color support ([#259](https://github.com/kintone/cli-kintone/issues/259)) ([f5fb446](https://github.com/kintone/cli-kintone/commit/f5fb446c9f05fda56df74269277e92799a72bb3a))
* ignore empty row when importing multiple tables ([#126](https://github.com/kintone/cli-kintone/issues/126)) ([d23f78c](https://github.com/kintone/cli-kintone/commit/d23f78cbb11b46c3f70faae5e86aec96ab62d3a4))
* making false the default value of the delete command prompt ([#411](https://github.com/kintone/cli-kintone/issues/411)) ([2641ec3](https://github.com/kintone/cli-kintone/commit/2641ec33c68f906292053003294d86e81ea22802))
* send request over HTTP tunneling ([#139](https://github.com/kintone/cli-kintone/issues/139)) ([54a1ac9](https://github.com/kintone/cli-kintone/commit/54a1ac929cb295573d587f1d8f749e1c9101400b))
* show correct error message when `--guest-space-id` option is missing ([#356](https://github.com/kintone/cli-kintone/issues/356)) ([b993c81](https://github.com/kintone/cli-kintone/commit/b993c81670ac479a70e30217b6aa9a61f12cd526))
* show help message when incorrect argv ([#97](https://github.com/kintone/cli-kintone/issues/97)) ([031713c](https://github.com/kintone/cli-kintone/commit/031713c56674dd3623cc8d1e41e441416339dbad))
* show version correctly ([#250](https://github.com/kintone/cli-kintone/issues/250)) ([da92cad](https://github.com/kintone/cli-kintone/commit/da92cad06da59be06b636aa20dcd71a1ad678050))
* the column order is different between with and without specifying the fields option ([#118](https://github.com/kintone/cli-kintone/issues/118)) ([f74961e](https://github.com/kintone/cli-kintone/commit/f74961e495c1d933df042e0fd445b26076d59179))
* the output of command completion is displayed incorrectly ([#169](https://github.com/kintone/cli-kintone/issues/169)) ([b44a99e](https://github.com/kintone/cli-kintone/commit/b44a99ef3d4b5c5b265a3e13bbb0fb0a70b2eb9c))
* throw an error if a specified field missing from CSV ([#55](https://github.com/kintone/cli-kintone/issues/55)) ([c71bff0](https://github.com/kintone/cli-kintone/commit/c71bff02fe2b29239a2c8de00ece6003c40a1eaa))
* unexpected error when the input is empty csv ([#61](https://github.com/kintone/cli-kintone/issues/61)) ([6168e22](https://github.com/kintone/cli-kintone/commit/6168e225ecb65c59b31ff9e8a874b8dc685d514a))
* wrap import/export in the record command ([#8](https://github.com/kintone/cli-kintone/issues/8)) ([3ac5236](https://github.com/kintone/cli-kintone/commit/3ac52364ae13114eac8ef4f35960ccfb1e1b44bd))


### Miscellaneous Chores

* version bump to 1.0.0 ([8fcb64e](https://github.com/kintone/cli-kintone/commit/8fcb64e6d30eb226ba20ac240197a52f7e1786b6))

## [1.8.2](https://github.com/kintone/cli-kintone/compare/v1.8.1...v1.8.2) (2023-08-07)


### Bug Fixes

* **deps:** update dependency inquirer to ^8.2.6 ([#422](https://github.com/kintone/cli-kintone/issues/422)) ([615a576](https://github.com/kintone/cli-kintone/commit/615a5761a9dd5680d823046e6cbf321b66455c76))

## [1.8.1](https://github.com/kintone/cli-kintone/compare/v1.8.0...v1.8.1) (2023-08-02)


### Bug Fixes

* making false the default value of the delete command prompt ([#411](https://github.com/kintone/cli-kintone/issues/411)) ([2641ec3](https://github.com/kintone/cli-kintone/commit/2641ec33c68f906292053003294d86e81ea22802))

## [1.8.0](https://github.com/kintone/cli-kintone/compare/v1.7.2...v1.8.0) (2023-07-26)


### Features

* specifying socket timeout ([#410](https://github.com/kintone/cli-kintone/issues/410)) ([b2cdb29](https://github.com/kintone/cli-kintone/commit/b2cdb291b7d66d9320656bcfea71a3df47c69740))


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^4.1.0 ([#405](https://github.com/kintone/cli-kintone/issues/405)) ([6b8a390](https://github.com/kintone/cli-kintone/commit/6b8a3907f51ccba79b8266cb56a131856f9bcbd1))
* **deps:** update dependency @kintone/rest-api-client to v4 ([#369](https://github.com/kintone/cli-kintone/issues/369)) ([1bd600a](https://github.com/kintone/cli-kintone/commit/1bd600a5fd6d61dc0943258645174a3048b539ec))

## [1.7.2](https://github.com/kintone/cli-kintone/compare/v1.7.1...v1.7.2) (2023-07-12)


### Bug Fixes

* allow Date field format is yyyy/mm/dd ([#390](https://github.com/kintone/cli-kintone/issues/390)) ([f9af100](https://github.com/kintone/cli-kintone/commit/f9af1005281955232c8ae7a067d4e834e9ee82a1))

## [1.7.1](https://github.com/kintone/cli-kintone/compare/v1.7.0...v1.7.1) (2023-06-26)


### Bug Fixes

* `undefined` error message of the upsert command ([#376](https://github.com/kintone/cli-kintone/issues/376)) ([1f922ca](https://github.com/kintone/cli-kintone/commit/1f922cae93f97546466019840ac2a217ccbbc0bb))

## [1.7.0](https://github.com/kintone/cli-kintone/compare/v1.6.0...v1.7.0) (2023-06-10)


### Features

* enable record import with a Record Number field ([#368](https://github.com/kintone/cli-kintone/issues/368)) ([ae4846e](https://github.com/kintone/cli-kintone/commit/ae4846e610d3d70c8c0052239d1d9597061b16c3))

## [1.6.0](https://github.com/kintone/cli-kintone/compare/v1.5.3...v1.6.0) (2023-06-07)


### Features

* enable upsert with non-updatable fields ([#366](https://github.com/kintone/cli-kintone/issues/366)) ([0e5f1d2](https://github.com/kintone/cli-kintone/commit/0e5f1d2504b05b1e9370fe721999d943cb211f02))


### Bug Fixes

* allow users to export an attachment with filename including a special character ([#358](https://github.com/kintone/cli-kintone/issues/358)) ([40a9c6f](https://github.com/kintone/cli-kintone/commit/40a9c6fa8eac7e923d566e3dfdd2eaebe020bea4))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.15 ([#359](https://github.com/kintone/cli-kintone/issues/359)) ([beaa913](https://github.com/kintone/cli-kintone/commit/beaa91384ac1b4dcc9d3f551f283b54431aeb7dc))

## [1.5.3](https://github.com/kintone/cli-kintone/compare/v1.5.2...v1.5.3) (2023-05-30)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.3.14 ([#350](https://github.com/kintone/cli-kintone/issues/350)) ([aa4ba94](https://github.com/kintone/cli-kintone/commit/aa4ba948f309d4059e465621a33fd09e6452361d))
* show correct error message when `--guest-space-id` option is missing ([#356](https://github.com/kintone/cli-kintone/issues/356)) ([b993c81](https://github.com/kintone/cli-kintone/commit/b993c81670ac479a70e30217b6aa9a61f12cd526))

## [1.5.2](https://github.com/kintone/cli-kintone/compare/v1.5.1...v1.5.2) (2023-05-24)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.3.13 ([#344](https://github.com/kintone/cli-kintone/issues/344)) ([9d9dd5a](https://github.com/kintone/cli-kintone/commit/9d9dd5a788677417d2104ac69c38fa7a7204e963))

## [1.5.1](https://github.com/kintone/cli-kintone/compare/v1.5.0...v1.5.1) (2023-05-15)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.3.12 ([#338](https://github.com/kintone/cli-kintone/issues/338)) ([2234cb0](https://github.com/kintone/cli-kintone/commit/2234cb0537854790f5394f1cd8fef82289f0f228))

## [1.5.0](https://github.com/kintone/cli-kintone/compare/v1.4.0...v1.5.0) (2023-05-10)


### Features

* improve memory usage of record export ([#311](https://github.com/kintone/cli-kintone/issues/311)) ([1c545c7](https://github.com/kintone/cli-kintone/commit/1c545c76cbfb4389ad8cd6972950a155eba834c3))


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.3.11 ([#323](https://github.com/kintone/cli-kintone/issues/323)) ([8ae01f0](https://github.com/kintone/cli-kintone/commit/8ae01f0b689f2c45b42a3ccad66e16d90ca7b078))
* **deps:** update dependency yargs to ^17.7.2 ([#325](https://github.com/kintone/cli-kintone/issues/325)) ([4c0b59b](https://github.com/kintone/cli-kintone/commit/4c0b59bc94ba50d94836ad1bacdb38e5e440cab0))

## [1.4.0](https://github.com/kintone/cli-kintone/compare/v1.3.3...v1.4.0) (2023-04-24)


### Features

* support proxy authentication ([#314](https://github.com/kintone/cli-kintone/issues/314)) ([6e69b3a](https://github.com/kintone/cli-kintone/commit/6e69b3ab246a06883105c359128455b1e0096cc1))


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.3.10 ([#317](https://github.com/kintone/cli-kintone/issues/317)) ([09d9b92](https://github.com/kintone/cli-kintone/commit/09d9b92691f8c882fb0f6574ccd9f780f43286a9))

## [1.3.3](https://github.com/kintone/cli-kintone/compare/v1.3.2...v1.3.3) (2023-04-18)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.3.4 ([#265](https://github.com/kintone/cli-kintone/issues/265)) ([35f2810](https://github.com/kintone/cli-kintone/commit/35f2810cff16ba5b77d2e031b450d469029aea8d))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.5 ([#275](https://github.com/kintone/cli-kintone/issues/275)) ([764f789](https://github.com/kintone/cli-kintone/commit/764f7898761c989e650b6e4075087e74ffdb3b06))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.6 ([#285](https://github.com/kintone/cli-kintone/issues/285)) ([9f7346b](https://github.com/kintone/cli-kintone/commit/9f7346b005086cd3f198ac0a185df24883ae74dc))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.7 ([#293](https://github.com/kintone/cli-kintone/issues/293)) ([bb9d366](https://github.com/kintone/cli-kintone/commit/bb9d3662c816f0a092816be84a6163563f27686a))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.8 ([#300](https://github.com/kintone/cli-kintone/issues/300)) ([c604709](https://github.com/kintone/cli-kintone/commit/c604709e06a01ee6861a11ceb3f68bbcb57a18d9))
* **deps:** update dependency @kintone/rest-api-client to ^3.3.9 ([#304](https://github.com/kintone/cli-kintone/issues/304)) ([ca85cea](https://github.com/kintone/cli-kintone/commit/ca85ceadf80fc27e2305c7bb643f830911aa5a66))

## [1.3.2](https://github.com/kintone/cli-kintone/compare/v1.3.1...v1.3.2) (2023-03-06)


### Bug Fixes

* **deps:** update dependency @kintone/rest-api-client to ^3.3.3 ([#261](https://github.com/kintone/cli-kintone/issues/261)) ([a11a430](https://github.com/kintone/cli-kintone/commit/a11a430a9cd1a8aa33ecd250639bc12619f3057e))
* **deps:** update dependency yargs to ^17.7.1 ([#231](https://github.com/kintone/cli-kintone/issues/231)) ([aa2737e](https://github.com/kintone/cli-kintone/commit/aa2737e7b38c650ebf2b003cc3ad49b357d14e7f))
* detection of color support ([#259](https://github.com/kintone/cli-kintone/issues/259)) ([f5fb446](https://github.com/kintone/cli-kintone/commit/f5fb446c9f05fda56df74269277e92799a72bb3a))

## [1.3.1](https://github.com/kintone/cli-kintone/compare/v1.3.0...v1.3.1) (2023-02-27)


### Bug Fixes

* show version correctly ([#250](https://github.com/kintone/cli-kintone/issues/250)) ([da92cad](https://github.com/kintone/cli-kintone/commit/da92cad06da59be06b636aa20dcd71a1ad678050))

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

### Chores

* minify executable packages ([#200](https://github.com/kintone/cli-kintone/issues/200)) ([0bcea22](https://github.com/kintone/cli-kintone/commit/0bcea228abd29425b697137a87ca7fcf874d3350))

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
