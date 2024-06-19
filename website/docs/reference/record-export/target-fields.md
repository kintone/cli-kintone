# Specify target fields

## Command-line interface

```shell
cli-kintone export --app 8 --fields 'Number,Text,'
```

| Parameter name | Short name | Description                                |
| -------------- | ---------- | ------------------------------------------ |
| --fields       |            | Comma-separated field codes to be exported |

## Target fields variation

### Without specifying target fields

All fields are exported

```shell
cli-kintone record export --app 27 | xsv table
*   Record_number  Number  Table     Number_0  Number_1  Table_0  Number_2  Number_3  Created_by             Created_datetime      Updated_by             Updated_datetime
*   1              1       53783     2         3                                      user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
    1              1       53785     2         3                                      user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
    1              1                                     53784    4         5         user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
    1              1                                     53786    4         5         user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
*   2              1       53788     2         3                                      user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
    2              1       53789     2         3                                      user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
    2              1                                     53790    4         5         user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
    2              1                                     53791    4         5         user01  2022-08-12T07:15:00Z  user01  2022-08-12T07:15:00Z
```

### Specifies fields

The specified fields are exported. The PRIMARY_MARK (\*) does not appear when the specified fields do not contain a table, even if the app has the table.

```shell
cli-kintone record export --app 27 --fields Record_number,Number | xsv table
Record_number Number
1 1
2 1
```

### Specifies a table field

The specified fields with every rows on the table are exported.

```shell
cli-kintone record export --app 27 --fields Table | xsv table

* Table Number_0 Number_1
* 53783 2 3
  53785 2 3
* 53788 2 3
  53789 2 3
```

### Errors

#### Specified a fields on the table

```shell
cli-kintone record export --app 27 --fields Number_0 | xsv table
Error: The specified field "Number_0" in a table cannot be specified to fields option
```

#### Specified PRIMARY_MARK(`*`)

```shell
cli-kintone record export --app 27 --fields '*' | xsv table
Error: The specified field "*" does not exist on the app
```

#### Specified a fields which does not exist

```shell
cli-kintone record export --app 27 --fields Rich_textan | xsv table
Error: The specified field "Rich_textan" does not exist on the app
```
