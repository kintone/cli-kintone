# フィールドの順序

## 対象フィールドを指定しない場合

対象フィールドを指定しない場合、列の順序は[kintoneフォームレイアウト](https://kintone.dev/en/docs/kintone/rest-api/apps/get-form-layout/)に従います。

例えば、アプリが以下のフォームレイアウトを持っている場合：

```
[Record_number]
[Created_datetime] [Updated_datetime]
[Created_by] [Updated_by]
[Text] [Number]
[Text_area]
```

==> 列は以下の順序になります

```shell
cli-kintone record export --app 27
"Record_number","Created_datetime","Updated_datetime","Created_by","Updated_by","Text","Number","Text_area"
"1","2022-08-12T07:15:00Z","2022-08-12T07:15:00Z","user01","user01","hello","1","content"
"2","2022-08-12T07:15:00Z","2022-08-12T07:15:00Z","user01","user01","goodbye","2","body"
```

## フィールドを指定する場合

対象フィールドを指定する場合、列の順序はユーザーが指定した順序と同じになります。

例えば、アプリが以下のフォームレイアウトを持っている場合：

```
[Record_number]
[Created_datetime] [Updated_datetime]
[Created_by] [Updated_by]
[Text] [Number]
[Text_area]
```

==> 列は以下の順序になります

```shell
cli-kintone record export --app 27 --fields Record_number,Number,Text_area,Text
"Record_number","Number","Text_area","Text"
"1","1","content","hello"
"2","2","body","goodbye"
```

## テーブルフィールドを指定する場合

対象フィールドを指定し、「テーブル」フィールドを含む場合、テーブル内のフィールドの順序は[kintoneフォームレイアウト](https://kintone.dev/en/docs/kintone/rest-api/apps/get-form-layout/)に従います。

例えば、アプリが以下のフォームレイアウトを持っている場合：

```
[Record_number]
[Name] [Class]
[Learning_score] *Learning_scoreはテーブルフィールド*
[Subject] [Score]
```

==> 列は以下の順序になります

```shell
cli-kintone record export --app 29 --fields Record_number,Name,Class,Learning_score

"*","Record_number","Name","Class","Learning_score","Subject","Score"
"*","1","user01","SP01","53783","Math","A"
,"1","user01","SP01","53783","Chemistry","B"
"*","2","user02","SP01","53783","Math","B"
,"2","user02","SP01","53783","Chemistry","A"
```
