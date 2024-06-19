# Ordering fields

## Without specifying target fields

When not specifying the target fields, the column order will be followed by [kintone form layout](https://kintone.dev/en/docs/kintone/rest-api/apps/get-form-layout/).

For example, the app has the following form layout:

```
[Record_number]
[Created_datetime] [Updated_datetime]
[Created_by] [Updated_by]
[Text] [Number]
[Text_area]
```

==> The column has the following order

```shell
cli-kintone record export --app 27
"Record_number","Created_datetime","Updated_datetime","Created_by","Updated_by","Text","Number","Text_area"
"1","2022-08-12T07:15:00Z","2022-08-12T07:15:00Z","user01","user01","hello","1","content"
"2","2022-08-12T07:15:00Z","2022-08-12T07:15:00Z","user01","user01","goodbye","2","body"
```

## Specifies fields

When specifying the target fields, the column order will be the same as the order of user specifies.

For example, the app has the following form layout:

```
[Record_number]
[Created_datetime] [Updated_datetime]
[Created_by] [Updated_by]
[Text] [Number]
[Text_area]
```

==> The column has the following order

```shell
cli-kintone record export --app 27 --fields Record_number,Number,Text_area,Text
"Record_number","Number","Text_area","Text"
"1","1","content","hello"
"2","2","body","goodbye"
```

## Specifies a table field

When specifying the target fields, and containing the “Table” field, the order of the table’s fields will be followed by [kintone form layout](https://kintone.dev/en/docs/kintone/rest-api/apps/get-form-layout/).

For example, the app has the following form layout:

```
[Record_number]
[Name] [Class]
[Learning_score] *Learning_score is a Table file*
[Subject] [Score]
```

==> The column has the following order

```shell
cli-kintone record export --app 29 --fields Record_number,Name,Class,Learning_score

"*","Record_number","Name","Class","Learning_score","Subject","Score"
"*","1","user01","SP01","53783","Math","A"
,,"1","user01","SP01","53783","Chemistry","B"
"*","2","user02","SP01","53783","Math","B"
,,"2","user02","SP01","53783","Chemistry","A"
```
