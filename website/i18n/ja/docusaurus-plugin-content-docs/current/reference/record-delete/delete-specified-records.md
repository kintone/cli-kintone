# 指定されたレコードの削除

## 詳細

`--file-path`オプションを指定することで、`delete`コマンドを使用してCSVファイルからレコードを削除できます。

コマンドラインインターフェース：

```shell
cli-kintone record delete --api-token <API_Token> --file-path <path_of_csv_file>
```

例：

```shell
cli-kintone record delete --api-token <API_Token> --file-path records_need_to_be_deleted.csv
```

現在、このコマンドはAPIトークンのみをサポートしています。

:::note[理由]
パスワード認証を利用可能にすると、仕様と実装が大幅に複雑になるか、パフォーマンスが低下するためです。

ユーザーがレコード削除権限を持っているかどうかを確認するには、[レコード権限の評価](https://kintone.dev/en/docs/kintone/rest-api/apps/evaluate-record-permissions/) APIを呼び出す必要があります。
このAPIは、リクエストごとに100レコードまでしか評価できません。

一方、評価せずにレコード削除を実行する場合、複雑な再試行プロセスを考慮する必要があります。
:::

CSVファイルにはレコード番号列が含まれている必要があります。
また、レコード番号列のヘッダー行は、kintoneサイトで定義されているレコード番号フィールドコードである必要があります。例：
kintoneのレコード番号フィールドコード：`Record_number`
CSVファイルの内容：

```csv
*,"Record_number","Text","Table","Table_Text","Table_Number"
*,"1","sample1","<row_id>","foo","4"
,"1","sample1","<row_id>","bar","5"
*,"2","sample2","<row_id>","hoge","6"
```

レコード番号列の値は、レコード番号またはアプリコードのいずれかです。例：

```csv
*,"Record_number","Text","Table","Table_Text","Table_Number"
*,"myapp-1","sample1","<row_id>","foo","4"
,"myapp-1","sample1","<row_id>","bar","5"
*,"myapp-2","sample2","<row_id>","hoge","6"
```

アプリコードを使用する場合、すべての行に同じアプリコード（混在しない）を含める必要があり、アプリコードはkintoneアプリのものと等しい必要があります。

ユーザーはCSVファイルのエンコーディングを指定することもできます。サポートされている文字エンコーディング：`utf8`、`sjis`。

コマンドが実行される前に、ユーザーはプロンプトでyes/noに答えてアクションを確認する必要があります。

```shell
cli-kintone record delete --app ${kintoneAppId} --file-path ${pathToCsvFile}
> Are you sure want to delete records? (y/N)
```

注意：

- 確認メッセージは現在のところ英語のみです。
- 回答を指定しない場合、デフォルトの回答はNoです。

または、ユーザーは`--yes`または`-y`オプションを指定して、プロンプトなしでコマンドを実行できます。

```shell
cli-kintone record delete --yes --app ${kintoneAppId} --file-path ${pathToCsvFile}
```

コマンドが正常に実行されると、以下のメッセージが表示されます。

```shell
INFO: Starting to delete records...
INFO: <number_of_deleted_records> records are deleted successfully
```

## 有効なケース

### 有効なレコード番号値

#### 入力例

```csv
Record_number
1
2
3
```

または

```csv
Record_number
appcode-1
appcode-2
appcode-3
```

#### 期待される結果

すべてのレコード[1, 2, 3]が削除されます。

有効な値とは：

- すべてのレコード番号が数値またはアプリコードで、混在していない。
- アプリコードがkintoneアプリのものと等しい。

#### 期待される出力

```shell
INFO: Starting to delete records...
INFO: 3 records are deleted successfully
```

## エラーと警告

(TBD)
