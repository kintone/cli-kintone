---
sidebar_position: 200
---

# インストール

このページは、cli-kintoneのインストールをサポートします。

## npmjs.comから

環境に[Node.js](https://nodejs.org/)を設定している場合、[npm](https://docs.npmjs.com/about-npm)を使用してcli-kintoneをインストールできます。
これは、プラグイン/カスタマイズ開発やCIでの使用に適しています。

以下のコマンドを実行します：

```shell
npm install @kintone/cli --global
```

または、ローカルにインストールする場合：

```shell
npm install @kintone/cli
```

npmパッケージの詳細については、[@kintone/cli](https://www.npmjs.com/package/@kintone/cli)をご覧ください。

## バイナリファイルから

1. [Releases](https://github.com/kintone/cli-kintone/releases)ページに移動します。
2. 「Assets」から、お使いのプラットフォーム用のZIPファイルをダウンロードします。
   - Windows: `cli-kintone_${version}_win.zip`
   - Linux: `cli-kintone_${version}_linux.zip`
   - macOS: `cli-kintone_${version}_macos.zip`
3. ダウンロードしたzipファイルを展開します
4. 以下のように展開したファイルを実行して、コマンドが使用可能であることを確認します。
   - Windows: コマンドプロンプトで`cli-kintone.exe`
   - Linux & macOS: ターミナルで`./cli-kintone`

### どこからでもcli-kintoneを実行する

任意のディレクトリから`cli-kintone`コマンドを実行するには、以下のいずれかを行います：

- 絶対パスを指定してコマンドを実行する
- PATH環境変数を設定する
- `cli-kintone`ファイルを`/usr/local/bin`ディレクトリに移動する（Linux & macOS用）

### コマンド補完

cli-kintoneは、**Tab**キーを使用して部分的に入力されたコマンドを補完するコマンド補完機能を提供しています。

:::info
cli-kintoneのコマンド補完は、現在`bash`と`zsh`シェルでサポートされています。
:::

#### zsh

`zsh`で有効にするには、cli-kintone実行ファイルが含まれるディレクトリに`cd`して、以下のコマンドを実行します：

```shell
# 1. PATH環境変数を設定
echo "export PATH=$(pwd):\$PATH" >> ~/.zshrc

# 2. 補完スクリプトを保存するディレクトリを作成して設定
mkdir -p ~/.zsh_completion.d/
echo 'fpath=(~/.zsh_completion.d $fpath)' >> ~/.zshrc

# 3. bash-autocomplete機能を有効化
echo 'autoload bashcompinit && bashcompinit' >> ~/.zshrc
echo 'autoload -Uz compinit && compinit' >> ~/.zshrc

# 4. コマンド補完スクリプトを作成
./cli-kintone completion >> ~/.zsh_completion.d/_cli-kintone

# 5. zshをリロード
source ~/.zshrc
```

#### bash

`bash`で有効にするには、cli-kintone実行ファイルが含まれるディレクトリに`cd`して、以下のコマンドを実行します：

```shell
# 1. コマンド補完スクリプトを作成
mkdir -p ~/.bash_completion.d
./cli-kintone completion >> ~/.bash_completion.d/_cli-kintone

# 2. bashにコマンド補完スクリプトを追加

# ログインシェルの場合
echo "export PATH=$(pwd):\$PATH" >> ~/.bash_profile
echo 'source ~/.bash_completion.d/_cli-kintone' >> ~/.bash_profile
source ~/.bash_profile

# 非ログインシェルの場合
echo "export PATH=$(pwd):\$PATH" >> ~/.bashrc
echo 'source ~/.bash_completion.d/_cli-kintone' >> ~/.bashrc
source ~/.bashrc
```

#### Windows OSの場合

Windows OSの場合、[WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)の`bash`を介してcli-kintoneのコマンド補完を使用できます。

手順：

1. WSLでWindows上にLinuxをインストールします。参照：[WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)。
2. 新しいLinuxターミナルを開きます。
3. [Linuxパッケージ](https://github.com/kintone/cli-kintone/releases)から実行ファイルをダウンロードして展開します。
4. [bashセクション](#bash)と同じコマンドを実行します。
