# Deleting all records

## Details

The `delete` command allows you to delete all permitted records of a specified kintone app.

Command-line interface:

```shell
cli-kintone record delete --base-url https://${yourDomain} --api-token ${apiToken} --app ${kintoneAppId}
```

Currently, this command only supports API Token.

TODO: add reason

:::note[Why?]
This is because making password authentication available would significantly complicate the specification and implementation or degrade performance.

To check whether a user has record deletion permissions, we need to call the [Evaluate Record Permissions](https://kintone.dev/en/docs/kintone/rest-api/apps/evaluate-record-permissions/) API.
This API can only evaluate 100 record per request.

On the other hand, if we perform record deletion without evaluation, we need to consider a complex retry process.
:::

If the user specifies username or password via the command option or ENV variable without api-token, an error will be thrown.

```shell
ERROR: The delete command only supports API token authentication
```

<details>
<summary>detailed cases</summary>

username: set by option or ENV or none
password: set by option or ENV or none
api-token: set by option or ENV
=> Do not throw the error message

username: set by option or ENV
password: set by option or ENV
api-token: none
=> throw the error message

username: set by option or ENV
password: none
api-token: none
=> throw the error message

username: none
password: set by option or ENV
api-token: none
=> throw the error message

</details>

Before the command is executed, the user must confirm the action by answering the prompt yes/no.

```shell
cli-kintone record delete --base-url https://${yourDomain} --api-token ${apiToken} --app ${kintoneAppId}
> Are you sure want to delete records? (y/N)
```

Notes:

- The confirmation message is in English only for now.
- If not specifying the answer, the default answer is No.

Or, the user can specify the option `--yes` or `-y` to execute the command without prompt.

```shell
cli-kintone record delete --yes --base-url https://${yourDomain} --api-token ${apiToken} --app ${kintoneAppId}
```

Once the command is executed successfully, the below message will be shown.

```shell
INFO: Starting to delete all records...
INFO: 2 records are deleted successfully
```

If there is no record in the specified app, a warning message will be shown.

```shell
INFO: Starting to delete all records...
WARN: The specified app does not have any records.
```

If the API Token does not have the delete permission, an error will be shown. Ref to [Errors](#errors) section.

## Implementation

The delete all records command is now using some APIs of [rest-api-cilent](https://github.com/kintone/js-sdk/tree/master/packages/rest-api-client)

- [getAllRecordsWithId](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#getallrecordswithid): this method is used to get the ID of all records
- [deleteAllRecords](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#deleteallrecords): this method is used to delete all records

The API [deleteAllRecords](https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/docs/record.md#deleteallrecords) split the records into chunks of 2000 records and process each chunk sequentially. Therefore, the rollback can be performed on each chunk of 2000 records.

## Errors

### An error occurs while deleting all records

When an error occurs while deleting all records, the process will stop at the current chunk. For example:

Assume that there are 10.000 records on the app and an error will happen at the index 2022th.

The following behavior will occur:

==>

- Records 1st → 2000th are deleted successfully
- Records 2001th → 10.000th are NOT deleted
- An error message is thrown
- Process is stopped

#### The format of the output when an error occurs

```shell
ERROR: Failed to delete all records.
ERROR: number_of_success/number_of_total records are deleted successfully.
ERROR: An error occurred while processing records.
ERROR: [error_status] [error_code] error_message (error_id)
```

For example:

```shell
ERROR: Failed to delete all records.
ERROR: 2000/6000 records are deleted.
ERROR:An error occurred while processing records.
ERROR: [404] [GAIA_RE01] The specified record (ID: 1054447) is not found. (v7jzg2VeSHu8biwO9jZ6)
```

### Using API Token which does not have the delete permission

If the user uses API Tokens and that token does not have the delete permission, the below error will be shown.

```shell
ERROR: Failed to delete all records.
ERROR: No records are deleted.
ERROR: An error occurred while processing records.
ERROR: [403] [GAIA_NO01] このAPIトークンでは、指定したAPIを実行できません。 (IY3EH6WWAPEX6KcyE5Qd)
```
