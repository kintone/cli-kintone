Feature: common test cases

  Scenario: @CliKintoneTest-2 Should return the error message when specifying unknown subcommand
    When I run the command with args "export"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown argument: export"

  Scenario: @CliKintoneTest-4 Should return the help description by --help
    When I run the command with args "--help"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "cli-kintone-(macos|win|linux) <command>"

  Scenario: CliKintoneTest-14 Should return the error message when no authorized information
    When I run the command with args "record export --base-url TEST_KINTONE_BASE_URL --app 1"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_AU01\] Please login."

  Scenario: CliKintoneTest-15 Should return the error message when the API token is incorrect
    When I run the command with args "record export --base-url TEST_KINTONE_BASE_URL --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-17 Should return the error message when the user information is incorrect
    When I run the command with args "record export --base-url TEST_KINTONE_BASE_URL --app 1 --username abc --password abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_WA01\] Password authentication failed."

  Scenario: CliKintoneTest-18 Should return the error message when authorization information is incomplete (password)
    When I run the command with args "record export --base-url TEST_KINTONE_BASE_URL --app 1 --username TEST_KINTONE_USERNAME"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_WA01\] Password authentication failed."

  Scenario: CliKintoneTest-19 Should return the error message when incorrect authorization information (password)
    When I run the command with args "record export --base-url TEST_KINTONE_BASE_URL --app 1 --username TEST_KINTONE_USERNAME --password abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_WA01\] Password authentication failed."
