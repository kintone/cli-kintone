# すべてのレコードの削除

## 詳細

`delete`コマンドを使用すると、指定されたkintoneアプリのすべての許可されたレコードを削除できます。

コマンドラインインターフェース：

```shell
cli-kintone record delete --base-url https://${yourDomain} --api-token ${apiToken} --app ${kintoneAppId}
```

現在、このコマンドはAPIトークンのみをサポートしています。

:::note[理由]
パスワード認証を利用可能にすると、仕様と実装が大幅に複雑になるか、パフォーマンスが低下するためです。

ユーザーがレコード削除権限を持っているかどうかを確認するには、[レコード権限の評価](https://kintone.dev/en/docs/kintone/rest-api/apps/evaluate-record-permissions/) APIを呼び出す必要があります。
このAPIは、リクエストごとに100レコードまでしか評価できません。

一方、評価せずにレコード削除を実行する場合、複雑な再試行プロセスを考慮する必要があります。
:::

ユーザーがapi-tokenなしでコマンドオプションまたは環境変数を介してユーザー名またはパスワードを指定した場合、エラーがスローされます。

```shell
ERROR: The delete command only supports API token authentication
```

<details>
<summary>詳細なケース</summary>

username: オプションまたは環境変数で設定、または設定なし
password: オプションまたは環境変数で設定、または設定なし
api-token: オプションまたは環境変数で設定
=> エラーメッセージをスローしない

username: オプションまたは環境変数で設定
password: オプションまたは環境変数で設定
api-token: 設定なし
=> エラーメッセージをスロー

username: オプションまたは環境変数で設定
password: 設定なし
api-token: 設定なし
=> エラーメッセージをスロー

username: 設定なし
password: オプションまたは環境変数で設定
api-token: 設定なし
=> エラーメッセージをスロー

</details>

コマンドが実行される前に、ユーザーはプロンプトでyes/noに答えてアクションを確認する必要があります。

```shell
cli-kintone record delete --base-url https://${yourDomain} --api-token ${apiToken} --app ${kintoneAppId}
> Are you sure want to delete records? (y/N)
```

注意：

- 確認メッセージは現在のところ英語のみです。
- 回答を指定しない場合、デフォルトの回答はNoです。

または、ユーザーは`--yes`または`-y`オプションを指定して、プロンプトなしでコマンドを実行できます。

```shell
cli-kintone record delete --yes --base-url https://${yourDomain} --api-token ${apiToken} --app ${kintoneAppId}
```

コマンドが正常に実行されると、以下のメッセージが表示されます。

```shell
INFO: Starting to delete all records...
INFO: 2 records are deleted successfully
```

指定されたアプリにレコードがない場合、警告メッセージが表示されます。

```shell
INFO: Starting to delete all records...
WARN: The specified app does not have any records.
```

APIトークンに削除権限がない場合、エラーが表示されます。[エラー](#errors)セクションを参照してください。

## 実装

すべてのレコードを削除するコマンドは、現在[rest-api-cilent](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client)のいくつかのAPIを使用しています

- [getAllRecordsWithId](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#getallrecordswithid): このメソッドは、すべてのレコードのIDを取得するために使用されます
- [deleteAllRecords](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#deleteallrecords): このメソッドは、すべてのレコードを削除するために使用されます

API [deleteAllRecords](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#deleteallrecords)は、レコードを2000レコードのチャンクに分割し、各チャンクを順次処理します。したがって、ロールバックは2000レコードの各チャンクで実行できます。

## エラー

### すべてのレコードの削除中にエラーが発生

すべてのレコードの削除中にエラーが発生すると、プロセスは現在のチャンクで停止します。例：

アプリに10,000レコードがあり、2022番目のインデックスでエラーが発生すると仮定します。

次の動作が発生します：

==>

- 1番目から2000番目のレコードは正常に削除されます
- 2001番目から10,000番目のレコードは削除されません
- エラーメッセージがスローされます
- プロセスが停止します

#### エラー発生時の出力形式

```shell
ERROR: Failed to delete all records.
ERROR: number_of_success/number_of_total records are deleted successfully.
ERROR: An error occurred while processing records.
ERROR: [error_status] [error_code] error_message (error_id)
```

例：

```shell
ERROR: Failed to delete all records.
ERROR: 2000/6000 records are deleted.
ERROR:An error occurred while processing records.
ERROR: [404] [GAIA_RE01] The specified record (ID: 1054447) is not found. (v7jzg2VeSHu8biwO9jZ6)
```

### 削除権限を持たないAPIトークンの使用

ユーザーがAPIトークンを使用し、そのトークンに削除権限がない場合、以下のエラーが表示されます。

```shell
ERROR: Failed to delete all records.
ERROR: No records are deleted.
ERROR: An error occurred while processing records.
ERROR: [403] [GAIA_NO01] このAPIトークンでは、指定したAPIを実行できません。 (IY3EH6WWAPEX6KcyE5Qd)
```
