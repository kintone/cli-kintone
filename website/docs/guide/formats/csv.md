---
sidebar_position: 1
---

# CSV

The first row (header row) lists the **field codes** of each field.  
Each subsequent row corresponds to a record. Each value represents the value of the field.

```csv
"Record_number","FieldCode1","FieldCode2"
"1","foo","bar"
"2","baz","qux"
```

Here are considerations for some field types:

#### Text area

If the value contains a line break, enclose the value in double quotes.

```csv
"TextAreaField"
"multi
line
text"
```

#### Check box, Multi-choice

Specify multiple values by separating them with line breaks (\n).

```csv
"CheckboxField"
"value1
value2"
```

#### User Selection, Department Selection, Group Selection

If multiple values are selected, they will be separated with a line break (\n) (equivalent to `value.code` in REST API).

```csv
"userSelectionField","departmentSelectionField","groupSelectionField"
"John
Bob","Development Div","Administrators"
```

#### Created by, Updated by

Specify the user's login name (equivalent to `value.code` in REST API).

```csv
"Created_by"
"John"
```

#### Attachment

Files in the same Attachment field (in the same Table row) are separated with line breaks (\n).

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

When exporting, only the file name will be outputted if the `--attachments-dir` option is NOT set.

```csv
"fileFieldCode"
"test.txt
test.txt"
```

If running on Windows environment and the filename contains Windows prohibited characters, replace them with `_` .

#### Table

- The row where a record begins has a PRIMARY_MARK(`*`) on the "`*`" field.
- The data of fields outside the Table are specified in the row with PRIMARY_MARK(`*`).
  - The data of fields outside the Table in other rows will be ignored.
- The data of fields inside the Table are specified with one or more rows.
  - If there is no data about the Table in the row, the row is ignored.

```csv
"*","Text","Table","TextInTable"
"*","first","<row id>","alice"
,"first","<row id>","bob"
```

with multiple Table fields

```csv
"*","Text","Table","TextInTable","Table_1","NumberInTable"
"*","first","<row id>","alice",,
,"first","<row id>","bob",,
,"first",,,"<row id>","10"
,"first",,,"<row id>","20"
```
