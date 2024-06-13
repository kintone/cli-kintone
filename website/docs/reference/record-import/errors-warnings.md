# Errors and Warnings

## Errors

When an error occurs during record import, the below error will be thrown.

Error format:

```
An error occurred on <field Code> at row <line of CSV>.
    Cause: <error message>
```

Example:

```
An error occurred on phone_number at row 2.
    Cause: Only numbers are allowed.
```

Below are the study cases of the error message

### One error occurred in a record

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (4Ax9owcXS1e8aYjRcRn8)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
```

### Two different type of errors occurred in a record

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (Vq2An4rki9tKh84yppfD)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on Number at row 3.
ERROR:     Cause: 数字でなければなりません。
```

### Two same-type errors occurred in a record

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (IWeQPfaRHsEJdAS4TOZq)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on lastname at row 2.
ERROR:     Cause: 必須です。
```

### Two different type and two same-type of errors occurred in a record

```
ERROR: [400] [CB_VA01] 入力内容が正しくありません。 (rgm6XXy1jItFPc3ndMep)
ERROR:   An error occurred on surname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on lastname at row 2.
ERROR:     Cause: 必須です。
ERROR:   An error occurred on Number at row 3.
ERROR:     Cause: 数字でなければなりません。
```

## Warnings

(TBD)
