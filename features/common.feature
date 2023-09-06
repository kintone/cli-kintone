Feature: common test cases

  Scenario: CliKintoneTest-2 Should return the error message when specifying unknown subcommand
    When I run the command with args "export"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown argument: export"

  Scenario: CliKintoneTest-4 Should return the help description by --help
    When I run the command with args "--help"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "cli-kintone-(macos|win|linux) <command>"

  Scenario: CliKintoneTest-1 Should return the error message when specifying unknown option
    When I run the command with args "record export --app 1 --base-url http://example.com --foo"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown argument: foo"

  Scenario: CliKintoneTest-5 Should return the error message when lacking of --base-url option
    When I run the command with args "record export --app 1"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: base-url"

  Scenario: CliKintoneTest-10 Should return the error message when lacking of --app option
    When I run the command with args "record export --base-url http://example.com"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: app"

  Scenario: CliKintoneTest-11 Should return the error message when lacking of the value of --app option
    When I run the command with args "record export --base-url http://example.com --app"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Not enough arguments following: app"
