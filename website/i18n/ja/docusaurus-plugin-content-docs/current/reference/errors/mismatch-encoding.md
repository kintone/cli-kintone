# エンコーディングの不一致

`import`および`delete`コマンドを実行する際、指定されたエンコーディング（デフォルトはUTF-8）が指定されたCSVファイルの実際のエンコーディングと一致しない場合、エラーが発生します。

エラーメッセージ

```shell
ERROR: Failed to decode the specified CSV file.
ERROR: The specified encoding (<<encoding>>) might mismatch the actual encoding of the CSV file.
```

## 実装

指定されたエンコーディング（デフォルトはUTF-8）でCSVファイルのヘッダー行をデコードした後、デコードされた文字列に変換不可能な文字が含まれている場合、エラーが発生します。

変換不可能な文字は`�`と`?`です（[iconv-lite](https://github.com/ashtuchkin/iconv-lite#other-notes)に記載されています）
