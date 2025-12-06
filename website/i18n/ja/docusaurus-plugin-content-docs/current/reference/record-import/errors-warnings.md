# エラーと警告

## エラー

レコードインポート中にエラーが発生すると、以下のエラーがスローされます。

エラー形式：

```
An error occurred on <field Code> at row <line of CSV>.
    Cause: <error message>
```

例：

```
An error occurred on phone_number at row 2.
    Cause: Only numbers are allowed.
```

以下は、エラーメッセージの検証ケースです

### レコードで1つのエラーが発生

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (4Ax9owcXS1e8aYjRcRn8)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
```

### レコードで2つの異なるタイプのエラーが発生

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (Vq2An4rki9tKh84yppfD)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on Number at row 3.
ERROR:     Cause: 数字でなければなりません。
```

### レコードで2つの同じタイプのエラーが発生

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (IWeQPfaRHsEJdAS4TOZq)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on lastname at row 2.
ERROR:     Cause: 必須です。
```

### レコードで2つの異なるタイプと2つの同じタイプのエラーが発生

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (rgm6XXy1jItFPc3ndMep)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on lastname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on Number at row 3.
ERROR:     Cause: 数字でなければなりません。
```

## 警告

(TBD)
