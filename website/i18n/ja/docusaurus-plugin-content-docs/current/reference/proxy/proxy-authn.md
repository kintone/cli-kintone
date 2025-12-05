# プロキシ認証

## 概要

cli-kintone v1は、現在のところプロキシ基本認証のみでプロキシ認証をサポートしています。

ユーザーは`--proxy`CLIオプションを指定するか、環境変数（ENV Vars）を使用してプロキシ認証を指定できます。

## 使用方法

以下は、プロキシ認証を指定する2つの方法です。

### `--proxy`オプションの使用

ユーザーは以下の形式で`--proxy`オプションを使用してプロキシ認証を指定できます：

```shell
--proxy http://user:pass@domain:port
```

例：

```shell
./cli-kintone --proxy http://myuser:mypass@mydomain.com:3128
```

### 環境変数の使用

ユーザーは環境変数を使用してプロキシ認証を指定できます：

- HTTPS_PROXY
- https_proxy

これらの変数には、以下の形式でプロキシURLを含める必要があります：

```shell
http://user:pass@domain:port
```

Linux/macOSでの例：

```shell
export https_proxy=http://user:pass@domain:port
```

:::note
`--proxy`オプションは環境変数よりも優先されます
:::
