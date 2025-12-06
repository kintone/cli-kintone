# ネットワークタイムアウト

ネットワークエラーが発生すると、以下のエラーメッセージが表示されます。

```shell
ERROR: [ECONNABORTED] timeout of 600000ms exceeded
ERROR: The cli-kintone aborted due to a network error.
ERROR: Please check your network connection.
```

以下は、cli-kintoneが処理するネットワークタイムアウトエラーのリストです

- ソケットタイムアウト - デフォルトは600秒

## 実装

@kintone/rest-api-clientは、ユーザーがソケットタイムアウトを指定できるようにします。そのため、KintoneRestAPIClientとの接続を確立する際に、cli-kintoneはそのオプションを指定します。

現在、エラーコードがECONNABORTEDの場合、そのエラーをネットワークエラーとみなします。
