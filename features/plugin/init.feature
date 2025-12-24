@isolated
@plugin-init
Feature: plugin init

  Scenario: Generate template (debug)
    When I run the command with a prompt with args "plugin init"
    # ? Input your project name (target directory) (./kintone-plugin)
    # ? Input your plug-in name in English [1-64chars] (kintone-plugin)
    # ? Input your plug-in description in English [1-200chars] (kintone-plugin)
    # ? Input your home page url for English (Optional)
    # ? Does your plug-in support Japanese? (y/N)
    # ? Does your plug-in support Chinese? (y/N)
    # ? Does your plug-in support Spanish? (y/N)
    And I write inputs and wait without closing stdin "\n\n\n\nn\nn\nn\n"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "Input your project name"
    And The output message should match with the pattern: "Input your plug-in name in English"
    And I have a directory at "kintone-plugin"

  @skip
  Scenario: Generate typescript template
    When I run the command with a prompt with args "plugin init --template typescript"
    # ? Input your project name (target directory) (./kintone-plugin)
    # ? Input your plug-in name in English [1-64chars] (kintone-plugin)
    # ? Input your plug-in description in English [1-200chars] (kintone-plugin)
    # ? Input your home page url for English (Optional)
    # ? Does your plug-in support Japanese? (y/N)
    # ? Does your plug-in support Chinese? (y/N)
    # ? Does your plug-in support Spanish? (y/N)
    And I type "\n\n\n\nn\nn\nn\n"
    And I close stdin and wait
    Then I should get the exit code is zero
    # Note: After stdin is closed, inquirer processes remaining questions silently with defaults
    # So we can only verify the first few prompts are displayed
    And The output message should match with the pattern: "Input your project name"
    And The output message should match with the pattern: "Input your plug-in name in English"
    And I have a directory at "kintone-plugin"

  @skip
  Scenario: Specify plugin name
    When I run the command with a prompt with args "plugin init --name test"
    # ? Input your plug-in name in English [1-64chars] (test)
    # ? Input your plug-in description in English [1-200chars] (test)
    # ? Input your home page url for English (Optional)
    # ? Does your plug-in support Japanese? (y/N)
    # ? Does your plug-in support Chinese? (y/N)
    # ? Does your plug-in support Spanish? (y/N)
    And I type "\n\n\n\nn\nn\nn\n"
    And I close stdin and wait
    Then I should get the exit code is zero
    # Note: After stdin is closed, inquirer processes remaining questions silently with defaults
    # So we can only verify the first few prompts are displayed
    And The output message should match with the pattern: "Input your plug-in name in English"
    And The output message should match with the pattern: "Input your plug-in description in English"
    And I have a directory at "test"

  @skip
  Scenario: Add multilingual info
    When I run the command with a prompt with args "plugin init"
    # ? Input your project name (target directory) (./kintone-plugin)
    # ? Input your plug-in name in English [1-64chars] (kintone-plugin)
    # ? Input your plug-in description in English [1-200chars] (kintone-plugin)
    # ? Input your home page url for English (Optional)
    # ? Does your plug-in support Japanese? (y/N) → y
    # ? Input your plug-in name in Japanese [1-64chars] (kintone-plugin)
    # ? Input your plug-in description in Japanese [1-200chars] (kintone-plugin)
    # ? Input your home page url for Japanese (Optional)
    # ? Does your plug-in support Chinese? (y/N) → y
    # ? Input your plug-in name in Chinese [1-64chars] (kintone-plugin)
    # ? Input your plug-in description in Chinese [1-200chars] (kintone-plugin)
    # ? Input your home page url for Chinese (Optional)
    # ? Does your plug-in support Spanish? (y/N) → y
    # ? Input your plug-in name in Spanish [1-64chars] (kintone-plugin)
    # ? Input your plug-in description in Spanish [1-200chars] (kintone-plugin)
    # ? Input your home page url for Spanish (Optional)
    And I type "\n\n\n\ny\n\n\n\ny\n\n\n\ny\n\n\n\n"
    And I close stdin and wait
    Then I should get the exit code is zero
    # Note: After stdin is closed, inquirer processes remaining questions silently with defaults
    # So we can only verify the first few prompts are displayed
    And The output message should match with the pattern: "Input your project name"
    And The output message should match with the pattern: "Input your plug-in name in English"
    And I have a directory at "kintone-plugin"

  @skip
  Scenario: Specified directory already exists
    Given The directory "test" exists
    When I run the command with a prompt with args "plugin init --name test"
    # ? Input your plug-in name in English [1-64chars] (test)
    # ? Input your plug-in description in English [1-200chars] (test)
    # ? Input your home page url for English (Optional)
    # ? Does your plug-in support Japanese? (y/N)
    # ? Does your plug-in support Chinese? (y/N)
    # ? Does your plug-in support Spanish? (y/N)
    And I type "\n\n\n\nn\nn\nn\n"
    And I close stdin and wait
    Then I should get the exit code is non-zero
    # Note: After stdin is closed, inquirer processes remaining questions silently with defaults
    # Then the directory existence check fails with the expected error
    And The output error message should match with the pattern: "already exists. Choose a different directory"
