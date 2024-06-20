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

- The column name is equal to the code of user selection field.
- The column contains login names of selected user(s).
- Multi users represented by separating a new-line character(LF).

### Group selection field

- The column name is equal to the code of group selection field.
- The column contains group code(s).
- Multi groups are represented by separating a new-line character(LF).

### Department selection field

- The column name is equal to the code of department selection field.
- The column contains department code(s).
- Multi departments are represented by separating a new-line character(LF).
