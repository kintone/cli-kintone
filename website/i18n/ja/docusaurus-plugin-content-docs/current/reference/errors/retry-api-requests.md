# APIリクエストの再試行

一部のタイプのAPIリクエストについて、cli-kintoneはエラー発生時にリクエストを再試行します。

## 再試行単位

再試行は各APIリクエストごとに実行されます。リクエストがBulk Request（`bulkRequest.json`）でラップされている場合、再試行は各bulkRequest単位で実行されます。

## 対象APIリクエスト

- [ファイルのダウンロード](https://kintone.dev/en/docs/kintone/rest-api/files/download-file/)（`GET /k/v1/file.json`）
  - 5xxエラー
- [ファイルのアップロード](https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/)（`POST /k/v1/file.json`）
  - 5xxエラー

## 戦略

[ジッターを含む指数バックオフ](https://aws.amazon.com/jp/blogs/architecture/exponential-backoff-and-jitter/)を使用します。

遅延時間は以下のように計算されます：

```
delay = Math.min(initialDelay * 2 ** (attemptCount - 1), maxDelay) + jitter;

- initialDelay: 初期遅延時間。デフォルトは1,000ms。
- attemptCount: リクエスト試行回数。最大5回。
- maxDelay: 最大遅延時間。デフォルトは60,000ms。
- jitter: 試行ごとにランダムに決定。0〜1,000msの間。
```
