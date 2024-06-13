# Character encoding

## Command-line interface

```shell
// Specify output character encoding
cli-kintone record export --app 8 --encoding sjis
```

| Parameter name | Short name | Description        |
| -------------- | ---------- | ------------------ |
| --encoding     |            | Character encoding |

## Character encoding

The `--encoding` option enables to select a character encoding of the output result. The following encodings are supports:

| Key    | Encode    |
| ------ | --------- |
| `utf8` | UTF-8     |
| `sjis` | Shift-JIS |

The default is `utf8`

## Errors

- Specified unsupported encoding
