---
sidebar_position: 100
---

# record export

`export`コマンドは、指定されたKintoneアプリからレコードデータをエクスポートします。

## 例

```shell
cli-kintone record export \
  --base-url https://${yourDomain} \
  --api-token ${apiToken} \
  --app ${kintoneAppId} \
> ${filepath}
```

## オプション

共通オプションについては、[オプション](/guide/options)ページをご覧ください。

| オプション          | 必須 | 説明                                                                                 |
| ------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--app`             | はい | アプリのID                                                                           |
| `--attachments-dir` |      | 添付ファイルディレクトリ                                                             |
| `--condition`、`-c` |      | クエリ文字列                                                                         |
| `--order-by`        |      | クエリとしてのソート順                                                               |
| `--fields`          |      | カンマ区切りでエクスポートするフィールド                                             |
| `--encoding  `      |      | 文字エンコーディング<br/>デフォルト：`utf8`<br/>エンコーディング：`utf8`および`sjis` |

### 注意

- テーブル内のフィールドは`fields`オプションに指定できません。

## `--condition`および`--order-by`オプション

`--condition`および`--order-by`オプションを使用してレコードをフィルタリングおよび並べ替えることができます。

これらのオプションは、[@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client#readme)の`getAllRecords()`に渡されます。

詳細は、[`getAllRecords()`](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#getallrecords)のドキュメントをご参照ください。

## 添付ファイルのダウンロード

`--attachments-dir`オプションが設定されている場合、添付ファイルはローカルディレクトリにダウンロードされます。

- ファイルパスは`<attachmentsDir>/<fieldCode>-<recordId>/<filename>`です。
  - テーブル内の添付フィールドの場合、ファイルパスは`<attachmentsDir>/<fieldCode>-<recordId>-<tableRowIndex>/<filename>`です。
- 同じ添付フィールド内で同じ名前のファイルがある場合、ファイルは`<filename> (<index>).<ext>`にリネームされます。
