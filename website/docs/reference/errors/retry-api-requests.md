# Retry API Requests

For some types of API requests, cli-kintone retries request on error.

## Retry units

Retries are performed for each API request. When requests are wrapped in Bulk Request (`bulkRequest.json`), retries will be performed for each bulkRequest unit.

## Target API requests

- [Download File](https://kintone.dev/en/docs/kintone/rest-api/files/download-file/) (`GET /k/v1/file.json`)
  - 5xx errors
  - Retryable 4xx errors
- [Upload File](https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/) (`POST /k/v1/file.json`)
  - 5xx errors
  - Retryable 4xx errors
- [Get Customization](https://kintone.dev/en/docs/kintone/rest-api/apps/settings/get-customization/) (`GET /k/v1/preview/app/customize.json`)
  - 5xx errors
  - Retryable 4xx errors
- [Update Customization](https://kintone.dev/en/docs/kintone/rest-api/apps/update-customization/) (`PUT /k/v1/preview/app/customize.json`)
  - 5xx errors
  - Retryable 4xx errors

## Strategy

We use [an exponential backoff with jitter](https://aws.amazon.com/jp/blogs/architecture/exponential-backoff-and-jitter/).

Delay time is calculated as follows:

```
delay = Math.min(initialDelay * 2 ** (attemptCount - 1), maxDelay) + jitter;

- initialDelay: Initial delay time. Default to 1,000ms.
- attemptCount: Number of request attempt. Maximum 5.
- maxDelay: Maximum delay time. Default to 60,000ms.
- jitter: Randomly determined per attempt. Between 0 - 1,000ms.
```
