# テーブル

## CSVファイル形式

### CSVファイルの例

```csv
"*","Text","Table","TextInTable"
"*","first","<row id>","alice"
,"first","<row id>","bob"
```

| \*  | Text  | Table      | TextInTable |
| --- | ----- | ---------- | ----------- |
| \*  | first | `<row id>` | alice       |
|     | first | `<row id>` | bob         |

### 複数のテーブルがある場合

```csv
"*","Text","Table","TextInTable","Table_1","NumberInTable"
"*","first","<row id>","alice",,
,"first","<row id>","bob",,
,"first",,,"<row id>","10"
,"first",,,"<row id>","20"
```

| \*  | Text  | Table      | TextInTable | Table_1    | NumberInTable |
| --- | ----- | ---------- | ----------- | ---------- | ------------- |
| \*  | first | `<row id>` | alice       |            |               |
|     | first | `<row id>` | bob         |            |               |
|     | first |            |             | `<row id>` | 10            |
|     | first |            |             | `<row id>` | 20            |

### 仕様

レコードが始まる行は、「\*」フィールドにPRIMARY_MARK(`*`)がある必要があります。

テーブル外のフィールドのデータは、PRIMARY_MARK(`*`)のある行で指定する必要があります

他の行のテーブル外のフィールドのデータは無視されます。
例：

```csv
"*","Text","Number","Table","TextInTable"
"*","first","10","<row id>","alice"
,"second","20","<row id>","bob"
```

==> レコードは以下のようにインポートされます：

- Text: `first`
- Number: `10`
- TextInTable: `[ alice , bob ]`

#### テーブル内の行

テーブル内のフィールドのデータは、1つまたは複数の行で指定する必要があります。

- 行に`<row_id>`があり、テーブル内のフィールドがない場合、空の行がインポートされます。
- 行に空の`<row_id>`がある場合
  - テーブル内のすべてのフィールドが空の場合、行は無視されます。
  - テーブル内のフィールドに有効な値がある場合、行が追加されます。

**アップサート**の場合、レコードがすでに存在する場合、インポートされる行は`<row_id>`に依存します

- CSVファイルの`<row_id>`がレコードに存在する場合、行を更新します。
- CSVファイルの`<row_id>`がレコードに存在しない場合、新しい行を挿入します。
- CSVファイルで指定されていないレコード上の行は削除されます。

例えば、テーブルがkintoneレコードに5行あり、CSVには既存の3行しかない場合。

→ アップサート後、テーブルは3行のみが残ります。他の2行は削除されます。

#### cli-kintoneが行内の欠落フィールド/空文字列を処理する方法

`--fields`オプションなしでimportコマンドを実行する場合：

- CSVヘッダーにテーブル内のフィールドが欠落している場合 => cli-kintoneはそのフィールドを無視します。
- 行のテーブル内のフィールド値が空文字列の場合 => cli-kintoneはそのフィールドを空文字列で追加/更新します。

[--fields](../target-fields.md)オプションを指定し、指定されたフィールドがテーブルフィールドの場合

- 行の`<row_id>`が空文字列の場合 => cli-kintoneはエラーをスローします。
- CSVヘッダーにテーブル内のフィールドが欠落している場合 => cli-kintoneはエラーをスローします。
- 行のテーブル内のフィールド値が空文字列の場合 => cli-kintoneはそのフィールドを空文字列で追加/更新します。

テーブル外のフィールドについては、[フィールド](./index.md)を参照してください。

#### エラー

| 原因                                                                                   | メッセージ                                                                 |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| CSVファイルの`<row_id>`が重複している場合                                             | `[520] [GAIA_SI01] Raw ID (code: Table) in a table is duplicated.`        |
| CSVファイルの`<row_id>`が文字列で、数値ではない場合                                   | `[400] [CB_IJ01] Invalid JSON string.`                                     |
| `--fields` Tableオプションでimportコマンドを実行し、テーブル内のフィールドがCSVヘッダーに欠落している場合 | `Error: The specified field "<<missing_field>>" does not exist on the CSV` |
| `--fields` Tableオプションでimportコマンドを実行し、行の`<row_id>`が空文字列の場合    | `Error: The specified field "Table" does not exist on the CSV`             |
