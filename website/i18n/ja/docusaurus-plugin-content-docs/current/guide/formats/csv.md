---
sidebar_position: 1
---

# CSV

最初の行（ヘッダー行）には、各フィールドの**フィールドコード**を記載します。
以降の各行はレコードに対応します。各値はフィールドの値を表します。

```csv
"Record_number","FieldCode1","FieldCode2"
"1","foo","bar"
"2","baz","qux"
```

いくつかのフィールドタイプの考慮事項は以下の通りです：

#### 文字列（複数行）

値に改行が含まれている場合は、値を二重引用符で囲みます。

```csv
"TextAreaField"
"multi
line
text"
```

#### チェックボックス、複数選択

複数の値を改行（\n）で区切って指定します。

```csv
"CheckboxField"
"value1
value2"
```

#### ユーザー選択、組織選択、グループ選択

複数の値が選択されている場合、改行（\n）で区切られます（REST APIの`value.code`と同等）。

```csv
"userSelectionField","departmentSelectionField","groupSelectionField"
"John
Bob","Development Div","Administrators"
```

#### 作成者、更新者

ユーザーのログイン名を指定します（REST APIの`value.code`と同等）。

```csv
"Created_by"
"John"
```

#### 添付ファイル

同じ添付ファイルフィールド（同じテーブル行）内のファイルは改行（\n）で区切られます。

```csv
"file"
"file-9/test.txt
file-9/test (1).txt"
```

```csv
"fileInTable"
"fileInTable-1-0/test.txt
fileInTable-1-0/test (1).txt"
```

エクスポート時、`--attachments-dir`オプションが設定されていない場合、ファイル名のみが出力されます。

```csv
"fileFieldCode"
"test.txt
test.txt"
```

Windows環境で実行していて、ファイル名にWindowsの禁止文字が含まれている場合、`_`に置き換えられます。

#### テーブル

- レコードが開始される行の「`*`」フィールドにPRIMARY_MARK（`*`）があります。
- テーブル外のフィールドのデータは、PRIMARY_MARK（`*`）のある行で指定されます。
  - 他の行のテーブル外のフィールドのデータは無視されます。
- テーブル内のフィールドのデータは、1行以上で指定されます。
  - 行にテーブルに関するデータがない場合、その行は無視されます。

```csv
"*","Text","Table","TextInTable"
"*","first","<row id>","alice"
,"first","<row id>","bob"
```

複数のテーブルフィールドがある場合

```csv
"*","Text","Table","TextInTable","Table_1","NumberInTable"
"*","first","<row id>","alice",,
,"first","<row id>","bob",,
,"first",,,"<row id>","10"
,"first",,,"<row id>","20"
```
