# 対象フィールドの指定

## コマンドラインインターフェース

```shell
cli-kintone record import --app 8 --file-path records.csv --fields 'Number,Text'
```

| パラメーター名 | 短縮名 | 説明                                     |
| -------------- | ------ | ---------------------------------------- |
| `--fields`     |        | インポートするフィールドコードのカンマ区切りリスト |

:::info
`--fields`オプションを指定すると、[フィールド](./fields/index.md)で説明されているフィールドの動作が変わります。

詳細については、以下のセクションを確認してください。
:::

## 対象フィールドのバリエーション

### 対象フィールドを指定する場合

指定されたフィールドのみがインポートされます

```shell
cli-kintone record import --app 27 --file-path records.csv --fields "Record_number,Text"
```

### テーブルフィールドを指定する場合

テーブル上のすべてのフィールドがインポートされます

```shell
cli-kintone record import --app 27 --file-path records.csv --fields Table
```

### 対象フィールドに更新キーが含まれていない場合

更新キーは対象フィールドに自動的に追加されます

```shell
cli-kintone record import --app 27 --file-path records.csv \
    --update-key UniqueText \
    --fields Number
# UniqueTextフィールドが対象フィールドに追加され、インポートが正常に完了します
```

### --fieldオプション、kintoneフィールドコード、CSV列

| --fieldパラメーター | kintoneアプリのフィールドコード | CSVの列名 | 期待される動作                                                                              |
| ------------------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| A, B                | A, B                            | A, B      | AとBをインポート                                                                            |
| A, B                | A                               | A         | kintoneアプリにフィールドAがあり、CSVファイルに列Bがないため、エラーが発生                  |
| A, B                | A, B                            | A         | CSVファイルに列Bがないため、エラーが発生                                                    |
| A, B                | A                               | A, B      | kintoneアプリにフィールドBがないため、エラーが発生                                          |
| A                   | A, B                            | A         | Aをインポート                                                                               |
| A                   | A                               | A, B      | Aをインポート                                                                               |
| A                   | B                               | B         | kintoneアプリにフィールドBがあり、CSVファイルに列Aがないため、エラーが発生                  |
| 指定なし            | A, B                            | A, B      | AとBをインポート                                                                            |
| 指定なし            | A                               | A, B      | Aをインポート                                                                               |

### エラー

#### テーブル内のフィールドが指定された

```shell
cli-kintone record import --app 27 --file-path records.csv --fields textInTable
Error: The specified field "textInTable" in a table cannot be specified to fields option
```

#### 空の値でテーブルフィールドが指定された

```shell
# records.csvは以下の通り
# "*","Text_0","Table","Text","Number"
# "*","Alice",,,
cli-kintone record import --app 27 --file-path records.csv --fields Table
Error: The specified field "Table" does not exist on the CSV
```

#### PRIMARY_MARK(`*`)が指定された

```shell
cli-kintone record import --app 27 --file-path records.csv --fields '*'
Error:The specified field "*" does not exist on the app
```

#### Kintoneアプリに存在しないフィールドが指定された

```shell
cli-kintone record import --app 27 --file-path records.csv --fields KintoneHyperField
Error:The specified field "KintoneHyperField" does not exist on the app
```

#### サポートされていないフィールドが指定された

```shell
cli-kintone record import --app 27 --file-path records.csv --fields Category
Error:The specified field "Category" is not supported
```

#### CSVファイルに存在しないフィールドが指定された

```shell
# records.csvにText列がない
cli-kintone record import --app 27 --file-path records.csv --fields Text,Number
Error: The specified field "Text" does not exist on the CSV
```
