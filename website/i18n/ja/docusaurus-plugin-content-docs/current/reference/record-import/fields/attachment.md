# 添付ファイル

## コマンドラインインターフェース

```shell
cli-kintone record import --app 8 --file-path records.csv --attachment-dir ./attachments
```

| パラメーター名      | 短縮名 | 説明                                             |
| ------------------- | ------ | ------------------------------------------------ |
| `--attachments-dir` |        | アップロードする添付ファイルを含むディレクトリ名 |

## 動作

添付ファイルを含むCSVファイルの例

```csv
"Record_number","Created_by","Portfolio","UserPhoto"
"1","tasshi","Portfolio-1/Resume.pdf","UserPhoto-1/Photo1.png
UserPhoto-1/Photo2.png"
"15","tasshi","Portfolio-15/Profile.pdf","UserPhoto-15/Photo1.png"
```

- `--attachments-dir`からの相対パス
- 複数の値は改行文字（LF）で区切られます
- 値で指定されたファイルがアップロードされます
- 添付されたファイルには、ローカルファイルと同じ名前が付けられます。

## アップロード手順

- ファイルのアップロードは、各レコードチャンクで処理されます
- ファイルのアップロードは、レコードの更新前に実行されます
- インポートされたフィールドに添付ファイルフィールドがあるにもかかわらず、`--attachments-dir`が指定されていない場合、エラーが発生します。
- ファイルのアップロードが失敗すると、レコードのインポートが中止されます。アップロード失敗の例：
  - ファイルが存在しない
  - ファイルサイズが1GBを超えている（[フィールド入力制限](https://get.kintone.help/k/en/user/app_settings/form/form_parts/field_restriction.html)）
