---
sidebar_position: 200
---

# Installation

This page will help you install cli-kintone.

## From npmjs.com

If you have configured [Node.js](https://nodejs.org/) on your environment, you can use [npm](https://docs.npmjs.com/about-npm) to install cli-kintone.
It is suitable for use in plugin/customization development or for CI.

Run the following command:

```shell
npm install @kintone/cli --global
```

Or to install locally:

```shell
npm install @kintone/cli
```

See [@kintone/cli](https://www.npmjs.com/package/@kintone/cli) for more details about our npm package.

## From binary file

1. Jump to the [Releases](https://github.com/kintone/cli-kintone/releases) page.
2. Download a ZIP file for your platform from "Assets".
   - Windows: `cli-kintone_${version}_win.zip`
   - Linux: `cli-kintone_${version}_linux.zip`
   - macOS: `cli-kintone_${version}_macos.zip`
3. Extract the downloaded zip file
4. Run the extracted file as follows and confirm that the command is available.
   - Windows: `cli-kintone.exe` on command prompt
   - Linux & macOS: `./cli-kintone` on terminal

### Run cli-kintone from anywhere

To run the `cli-kintone` command from any directory, do one of the following:

- Run the command while specifying the absolute path
- Set the PATH environment
- Move the `cli-kintone` file to the `/usr/local/bin` directory (for Linux & macOS)

### Command completion

cli-kintone provides a command-completion feature that lets you use the **Tab** key to complete a partially entered command.

:::info
cli-kintone command completion is now supported for `bash` and `zsh` shells.
:::

#### zsh

To enable it in `zsh`, `cd` to the directory that contains the cli-kintone executable file, then run the following commands:

```shell
# 1. Set PATH environment variables
echo "export PATH=$(pwd):\$PATH" >> ~/.zshrc

# 2. Create and configure a directory to store the completion scripts
mkdir -p ~/.zsh_completion.d/
echo 'fpath=(~/.zsh_completion.d $fpath)' >> ~/.zshrc

# 3. Enable bash-autocomplete feature
echo 'autoload bashcompinit && bashcompinit' >> ~/.zshrc
echo 'autoload -Uz compinit && compinit' >> ~/.zshrc

# 4. Create command completion script
./cli-kintone completion >> ~/.zsh_completion.d/_cli-kintone

# 5. Reload zsh
source ~/.zshrc
```

#### bash

To enable it in `bash`, `cd` to the directory that contains the cli-kintone executable file, then run the following commands:

```shell
# 1. Create command completion script
mkdir -p ~/.bash_completion.d
./cli-kintone completion >> ~/.bash_completion.d/_cli-kintone

# 2. Add command completion script to bash

# For login shell
echo "export PATH=$(pwd):\$PATH" >> ~/.bash_profile
echo 'source ~/.bash_completion.d/_cli-kintone' >> ~/.bash_profile
source ~/.bash_profile

# For non-login shell
echo "export PATH=$(pwd):\$PATH" >> ~/.bashrc
echo 'source ~/.bash_completion.d/_cli-kintone' >> ~/.bashrc
source ~/.bashrc
```

#### For Windows OS

For Windows OS, you can use cli-kintone command completion via `bash` on [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)

Steps:

1. Install Linux on Windows with WSL. Ref: [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install).
2. Open a new Linux Terminal.
3. Download and extract executables from the [Linux package](https://github.com/kintone/cli-kintone/releases).
4. Run the same commands as the [bash section](#bash).
