# 対象フィールドの指定

## コマンドラインインターフェース

```shell
cli-kintone record export --app 8 --fields 'Number,Text,'
```

| パラメーター名 | 短縮名 | 説明                                     |
| -------------- | ------ | ---------------------------------------- |
| --fields       |        | エクスポートするフィールドコードのカンマ区切りリスト |

## 対象フィールドのバリエーション

### 対象フィールドを指定しない場合

すべてのフィールドがエクスポートされます

```shell
cli-kintone record export --app 27
"*","Record_number","Number","Table","Number_0","Number_1","Table_0","Number_2","Number_3","Created_by","Created_datetime","Updated_by","Updated_datetime"
"*","1","1","53783","2","3",,,,"user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z"
,"1","1","53785","2","3",,,,"user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z"
","1","1",,,,"53784","4","5","user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z
","1","1",,,,"53786","4","5","user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z
"*","2","1","53788","2","3",,,,"user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z"
,"2","1","53789","2","3",,,,"user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z"
,"2","1",,,,"53790","4","5","user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z
,"2","1",,,,"53791","4","5","user01","2022-08-12T07:15:00Z","user01","2022-08-12T07:15:00Z
```

### フィールドを指定する場合

指定されたフィールドがエクスポートされます。指定されたフィールドにテーブルが含まれていない場合、アプリにテーブルがあっても、PRIMARY_MARK (\*)は表示されません。

```shell
cli-kintone record export --app 27 --fields Record_number,Number
"Record_number","Number"
"1","1"
"2","1"
```

### テーブルフィールドを指定する場合

指定されたフィールドとテーブル上のすべての行がエクスポートされます。

```shell
cli-kintone record export --app 27 --fields Table

"*","Table","Number_0","Number_1"
"*","53783","2","3"
,"53785","2","3"
"*","53788","2","3"
,"53789","2","3"
```

### エラー

#### テーブル内のフィールドが指定された

```shell
cli-kintone record export --app 27 --fields Number_0
Error: The specified field "Number_0" in a table cannot be specified to fields option
```

#### PRIMARY_MARK(`*`)が指定された

```shell
cli-kintone record export --app 27 --fields '*'
Error: The specified field "*" does not exist on the app
```

#### 存在しないフィールドが指定された

```shell
cli-kintone record export --app 27 --fields Rich_textan
Error: The specified field "Rich_textan" does not exist on the app
```
