# Table

## CSV file format

### CSV file example

```csv
"*","Text","Table","TextInTable"
"*","first","<row id>","alice"
,"first","<row id>","bob"
```

| \*  | Text  | Table      | TextInTable |
| --- | ----- | ---------- | ----------- |
| \*  | first | `<row id>` | alice       |
|     | first | `<row id>` | bob         |

### With multiple tables

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

### Specification

- The row where a record begins has a PRIMARY*MARK(`*`) on the “\*“ field.
- The data of fields outside the Table are repeated in all rows.
- The data of fields inside the Table are specified with one or multiple rows
  - Each row contains data for one table only
