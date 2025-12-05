# ユーザー選択、組織選択、グループ選択

## CSVファイル形式

### CSVファイルの例

```csv
"Record_number","User_selection","Group_selection","Department_selection"
"2","user01
user02
user03","Dev team1
Dev team2","Develepment dept.
Sales dept."
"1","user02","Dev team1","Sales dept."
```

### ユーザー選択フィールド

- 列名はユーザー選択フィールドのコードと等しい。
- 列には選択されたユーザーのログイン名が含まれます。
- 複数のユーザーは改行文字（LF）で区切られます。

### グループ選択フィールド

- 列名はグループ選択フィールドのコードと等しい。
- 列にはグループコードが含まれます。
- 複数のグループは改行文字（LF）で区切られます。

### 組織選択フィールド

- 列名は組織選択フィールドのコードと等しい。
- 列には組織コードが含まれます。
- 複数の組織は改行文字（LF）で区切られます。
