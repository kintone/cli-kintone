# Network timeout

When a network error occurs, an error message will be thrown as below.

```shell
ERROR: [ECONNABORTED] timeout of 1ms exceeded
ERROR: The cli-kintone aborted due to a network error.
ERROR: Please check your network connection.
```

Below is the list of network timeout errors that cli-kintone handles

- Socket timeout - Default is 60 seconds

## Implementation

@kintone/rest-api-client allows the user to specify the socket timeout. So, when establishing a connection with the KintoneRestAPIClient, cli-kintone specifies that option.

Currently, we consider an error as a network error if It has the error code ECONNABORTED.
