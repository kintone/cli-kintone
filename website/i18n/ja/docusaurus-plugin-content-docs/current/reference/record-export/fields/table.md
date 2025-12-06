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

- レコードが始まる行は、「\*」フィールドにPRIMARY_MARK(`*`)があります。
- テーブル外のフィールドのデータは、すべての行で繰り返されます。
- テーブル内のフィールドのデータは、1つまたは複数の行で指定されます
  - 各行には1つのテーブルのデータのみが含まれます
