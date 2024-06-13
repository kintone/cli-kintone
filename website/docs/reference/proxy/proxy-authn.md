# Proxy authentication

## Overview

cli-kintone v1 supports Proxy Authentication with only Proxy Basic Authn for now.

Users can specify the Proxy Authn by specifying `--proxy` CLI option or using environment variables (ENV Vars).

## Usage

Below are two ways to specify Proxy Authn.

### Using `--proxy` option

Users can specify the Proxy Authn using `--proxy` option in the following format:

```shell
--proxy http://user:pass@domain:port
```

For example:

```shell
./cli-kintone --proxy http://myuser:mypass@mydomain.com:3128
```

### Using environment variables

Users can specify the Proxy Authn using the ENV Vars:

- HTTPS_PROXY
- https_proxy

These variables should contain the Proxy URL in the following format:

```shell
http://user:pass@domain:port
```

For example on Linux/macOS:

```shell
export https_proxy=http://user:pass@domain:port
```

:::note
The `--proxy` option is prioritized over ENV vars
:::
