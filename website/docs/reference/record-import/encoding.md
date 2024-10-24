# Character encoding

## Command-line interface

```shell
// specify a character encoding
cli-kintone record import --app 8 --file-path records.csv --encoding sjis
```

| Parameter name | Short name | Description                           |
| -------------- | ---------- | ------------------------------------- |
| `--encoding`   |            | Character-set encoding for input file |

## Specify a character encoding

The `--encoding` option allows to specify a character encoding on importing CSV files. The following encodings are available:

| Key    | Encode    |
| ------ | --------- |
| `utf8` | UTF-8     |
| `sjis` | Shift-JIS |

The default is `utf8`

## Errors

- Specified unsupported encoding
- [Mismatch encoding](../errors/mismatch-encoding.md)
