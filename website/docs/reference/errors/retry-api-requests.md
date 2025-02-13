# Retry API Requests

For some types of API requests, cli-kintone retries request on error.

## Target API requests

- [Download File](https://kintone.dev/en/docs/kintone/rest-api/files/download-file/) (`GET /k/v1/file.json`)
  - 5xx errors
- [Upload File](https://kintone.dev/en/docs/kintone/rest-api/files/upload-file/) (`POST /k/v1/file.json`)
  - 5xx errors

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
