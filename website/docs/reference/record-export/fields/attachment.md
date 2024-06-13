# Attachment

## Command-line interface

```shell
cli-kintone export --app 8 --attachment-dir ./attachments
```

| Parameter name      | Short name | Description                                            |
| ------------------- | ---------- | ------------------------------------------------------ |
| `--attachments-dir` |            | The output directory where the download files saved on |

## Downloading files

An example of the downloaded file and structure

```
attachmentsDir
├── Portfolio-1
│   └── Profile.pdf
├── Portfolio-15
│   └── Portfolio.pdf
├── UserPhoto-1
│   ├── Photo1.png
│   └── Photo2.png
└── UserPhoto-15
└── Photo1.png
```

## Path naming

The attachment field out of a table

```
<attachment-dir>/<field code>-<record id>/<filename>
```

The attachment field on a table

```
<attachment-dir>/<the field code>-<record id>-<the index of the row on the table>/<filename>
```

The flow of the conversion process for file names

1. Replace prohibited characters (Windows only)
2. Rename the duplicated file name

## Replace prohibited characters (Windows only)

If running on a Windows environment and the filename contains Windows-prohibited characters, replace them with `_`.

Windows prohibited characters are `< > : " / \ | ? *`.

Example:

```
text<>.txt → text__.txt
```

## Rename the duplicated file name

When the attachment fields has same file names

```
<filename> (<index>).<ext>
```

Example:

```
Portfolio.pdf
Portfolio (1).pdf
Portfolio (2).pdf
Portfolio (3).pdf
```

NOTE: The destination directory will be created automatically if it doesn’t exist.

## File names on CSV file

An example of a CSV file that contains attachment files

```
"Record_number","Created_by","Portfolio","UserPhoto"
"1","tasshi","Portfolio-1/Profile.pdf","UserPhoto-1/Photo1.png
UserPhoto-1/Photo2.png"
"15","tasshi","Portfolio-15/Portfolio.pdf","UserPhoto-15/Photo1.png"
```

- The column has a name wich an attachment field code.
- The column has a value indicating the downloaded file path.
- The file path is a relative path of the --attachment-dir
- Multiple file names are separated by a new-line character (LF).
