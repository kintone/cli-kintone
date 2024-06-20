# User selection, Department selection, and Group selection

## CSV file format

### CSV file example

```csv
"Record_number","User_selection","Group_selection","Department_selection"
"2","user01
user02
user03","Dev team1
Dev team2","Develepment dept.
Sales dept."
"1","user02","Dev team1","Sales dept."
```

### User selection field

- The column name should have a name which equals to the field code of the user selection field.
- The column should contains user's login name(s).
- Multi user names should be separated by a new-line character (LF)

### Group selection field

- The column name should have a name which equals to the field code of the group selection field.
- The column should group code(s).
- Multi groups should be separated by a new-line character (LF)

### Department selection field

- The column name should have a name which equals to the field code of the department selection field.
- The column should department code(s).
- Multi departments should be separated by a new-line character (LF)
