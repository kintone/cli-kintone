Feature: cli-kintone common test cases

  Scenario: CliKintoneTest-1 Should return the error message when specifying unknown option
    When I run the command with args "record export --app 1 --base-url http://example.com --foo"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown argument: foobar"

  Scenario: CliKintoneTest-2 Should return the error message when specifying unknown subcommand
    When I run the command with args "foo"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown argument: foo"

  Scenario: CliKintoneTest-3 Should return the cli-kintone version in correct format when using `cli-kintone --version`
    When I run the command with args "--version"
    Then I should get the version formatted in "\d+.\d+.\d+"

  Scenario: CliKintoneTest-4 Should return the help description by --help
    When I run the command with args "--help"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "cli-kintone-(macos|win\.exe|linux) <command>"

  Scenario: CliKintoneTest-5 Should return the error message when lacking of --base-url option
    When I run the command with args "record export --app 1"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: base-url"

  Scenario: CliKintoneTest-6 Should return the error message when the baseUrl is non-existent subdomain
    When I run the command with args "record export --base-url https://CED2-4782-BB99-1ED18B89E0DA.cybozu.com --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "404: Not Found"

  Scenario: CliKintoneTest-8 Should return the error message when the protocol of baseUrl is not HTTPS
    When I run the command with args "record export --base-url http://example.cybozu.com --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: The protocol of baseUrl must be \"https\"."

  Scenario: CliKintoneTest-9 Should return the error message when the baseUrl is not URL format
    When I run the command with args "record export --base-url foo --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: TypeError \[ERR_INVALID_URL]: Invalid URL"

  Scenario: CliKintoneTest-10 Should return the error message when lacking of --app option
    When I run the command with args "record export --base-url http://example.com"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: app"

  Scenario: CliKintoneTest-11 Should return the error message when lacking the value of --app option
    When I run the command with args "record export --base-url http://example.com --app"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Not enough arguments following: app"

  Scenario: CliKintoneTest-12 Should return the error message when the app doesn't exist
    Given Load username and password of user "user_for_common" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[404] \[GAIA_AP01] The app \(ID: 1\) not found. The app may have been deleted."

  Scenario: CliKintoneTest-13 Should return the error message when missing the --guest-space-id option and the app is in a guest space.
    Given Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load username and password of user "user_for_guest_space" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Please specify --guest-space-id option to access an App in Guest Spaces."

  Scenario: CliKintoneTest-14 Should return the error message when no authorized information
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_AU01\] Please login."

  Scenario: CliKintoneTest-15 Should return the error message when the API token is incorrect
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-17 Should return the error message when the user information is incorrect
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username abc --password abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_WA01\] Password authentication failed."

  Scenario: CliKintoneTest-18 Should return the error message when authorization information is incomplete (password)
    Given Load username and password of user "user_for_common" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username $USERNAME"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_WA01\] Password authentication failed."

  Scenario: CliKintoneTest-19 Should return the error message when incorrect authorization information (password)
    Given Load username and password of user "user_for_common" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username $USERNAME --password abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[CB_WA01\] Password authentication failed."
