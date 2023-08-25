Feature: common test cases

  Scenario: @CliKintoneTest-2 Should return the error message when specifying unknown subcommand
    When I run the command with args "export"
    Then I should get the exit code is non-zero
    And The out error message is "Unknown argument: export"

  Scenario: @CliKintoneTest-4 Should return get help description by --help
    When I run the command with args "--help"
    Then I should get the exit code is zero
    And The output message contains "cli-kintone-macos <command>"

