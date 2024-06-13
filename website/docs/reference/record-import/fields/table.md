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

The row where a record begins should have a PRIMARY_MARK(`*`) on the “\*“ field.

The data of fields outside the Table should be specified in the row with PRIMARY_MARK(`*`)

The data of fields outside the Table in other rows will be ignored.
For example:

```csv
"*","Text","Number","Table","TextInTable"
"*","first","10","<row id>","alice"
,"second","20","<row id>","bob"
```

==> The record will be imported as follows:

- Text: `first`
- Number: `10`
- TextInTable: `[ alice , bob ]`

#### Rows in the Table

The data of fields inside the Table should be specified with one or multiple rows.

- If the row has a `<row_id>` and without fields in the Table, an empty row will be imported.
- If the row has an empty `<row_id>`
  - If all fields in the table are empty, the row is ignored.
  - If fields in the table have valid values, the row is added.

For **upserting**, if the record has already existed, the imported rows are dependent on the `<row_id>`

- If `<row_id>` on the CSV file exists on the record, update the row.
- If `<row_id>` on the CSV file does not exist on the record, insert a new row.
- The rows on the record that are not specified in the CSV file will be deleted.

For example, if the Table has five rows on kintone record, and the CSV has only three existing rows.

→ After upserting, the Table remains only three rows. Two other rows will be deleted.

#### How cli-kintone treats missing field/empty string in row

When running the import command without the `--fields` option:

- If the field inside the Table is missing on the CSV header => cli-kintone will ignore that field.
- If the field inside the Table value in the row is an empty string => cli-kintone will add/update that field with an empty string.

With the [--fields](../target-fields) option and the specified field is a Table field

- If the `<row_id>` in the row is an empty string => cli-kintone will throw an error.
- If the field inside the Table is missing on the CSV header => cli-kintone will throw an error.
- If the field inside the Table value in the row is an empty string => cli-kintone will add/update that field with an empty string.

For the field outside the Table, refer to [Fields](../).

#### Errors

| Cause                                                                                                                         | Message                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| If `<row_id>` on the CSV file is duplicated                                                                                   | `[520] [GAIA_SI01] Raw ID (code: Table) in a table is duplicated.`         |
| If `<row_id>` on the CSV file is a string, not a number                                                                       | `[400] [CB_IJ01] Invalid JSON string.`                                     |
| When running the import command with the `--fields` Table option and the field inside the table is missing on the CSV header. | `Error: The specified field "<<missing_field>>" does not exist on the CSV` |
| When running the import command with the `--fields` Table option and the `<row_id>` in the row is an empty string             | `Error: The specified field "Table" does not exist on the CSV`             |
