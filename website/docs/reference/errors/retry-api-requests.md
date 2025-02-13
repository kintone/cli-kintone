# Retry API Requests

For some types of API requests, cli-kintone retries request on error.

## Target API requests

- Download File (`GET /k/v1/file.json`)
  - 5xx errors
- Upload File (`POST /k/v1/file.json`)
  - 5xx errors

## Strategy

We use [an exponential backoff with jitter](https://aws.amazon.com/jp/blogs/architecture/exponential-backoff-and-jitter/).
