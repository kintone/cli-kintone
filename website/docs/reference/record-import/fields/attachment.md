# Attachment

## Command-line interface

```shell
cli-kintone record import --app 8 --file-path records.csv --attachment-dir ./attachments
```

| Parameter name      | Short name | Description                                            |
| ------------------- | ---------- | ------------------------------------------------------ |
| `--attachments-dir` |            | A directory name containing attachments to be uploaded |

## Behavior

An example CSV file contains attachments

```csv
"Record_number","Created_by","Portfolio","UserPhoto"
"1","tasshi","Portfolio-1/Resume.pdf","UserPhoto-1/Photo1.png
UserPhoto-1/Photo2.png"
"15","tasshi","Portfolio-15/Profile.pdf","UserPhoto-15/Photo1.png"
```

- A relative path of the `--attachments-dir`
- Multiple values are separated by a new-line character (LF)
- The file specified by the value is uploaded
- The attached file has a name that equals the local one.

## Upload procedure

- Uploading files are processed on each record chunks
- Uploading files are performed before updating records
- An error occurs when the imported fields have an attachment field, but the `--attachments-dir` is not specified.
- Importing records aborts when the uploading files fail. Examples of uploading failure:
  - The file does not exist
  - The file is too large
