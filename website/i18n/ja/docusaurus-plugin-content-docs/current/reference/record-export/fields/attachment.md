# 添付ファイル

## コマンドラインインターフェース

```shell
cli-kintone record export --app 8 --attachment-dir ./attachments
```

| パラメーター名      | 短縮名 | 説明                                               |
| ------------------- | ------ | -------------------------------------------------- |
| `--attachments-dir` |        | ダウンロードしたファイルを保存する出力ディレクトリ |

## ファイルのダウンロード

ダウンロードされたファイルと構造の例

```
attachmentsDir
├── Portfolio-1
│   └── Profile.pdf
├── Portfolio-15
│   └── Portfolio.pdf
├── UserPhoto-1
│   ├── Photo1.png
│   └── Photo2.png
└── UserPhoto-15
└── Photo1.png
```

## パスの命名規則

テーブル外の添付ファイルフィールド

```
<attachment-dir>/<フィールドコード>-<レコードID>/<ファイル名>
```

テーブル内の添付ファイルフィールド

```
<attachment-dir>/<フィールドコード>-<レコードID>-<テーブル内の行のインデックス>/<ファイル名>
```

ファイル名の変換処理フロー

1. 禁止文字の置換（Windowsのみ）
2. 重複したファイル名の名前変更

## 禁止文字の置換（Windowsのみ）

Windows環境で実行され、ファイル名にWindows禁止文字が含まれている場合、それらを`_`に置換します。

Windows禁止文字は`< > : " / \ | ? *`です。

例：

```
text<>.txt → text__.txt
```

## 重複したファイル名の名前変更

添付ファイルフィールドに同じファイル名がある場合

```
<ファイル名> (<インデックス>).<拡張子>
```

例：

```
Portfolio.pdf
Portfolio (1).pdf
Portfolio (2).pdf
Portfolio (3).pdf
```

注意：保存先ディレクトリが存在しない場合、自動的に作成されます。

## CSVファイル内のファイル名

添付ファイルを含むCSVファイルの例

```csv
"Record_number","Created_by","Portfolio","UserPhoto"
"1","tasshi","Portfolio-1/Profile.pdf","UserPhoto-1/Photo1.png
UserPhoto-1/Photo2.png"
"15","tasshi","Portfolio-15/Portfolio.pdf","UserPhoto-15/Photo1.png"
```

- 列名は添付ファイルフィールドコードです。
- 列の値はダウンロードされたファイルパスを示します。
- ファイルパスは--attachment-dirからの相対パスです。
- 複数のファイル名は改行文字（LF）で区切られます。
