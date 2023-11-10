@isolated
Feature: cli-kintone import command

  Scenario: CliKintoneTest-23 Should import the records with API Token successfully
    Given The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" with "$$TEST_KINTONE_API_TOKEN_FOR_IMPORT_DELETE" has no records
    And The csv file "CliKintoneTest-23.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_IMPORT --file-path CliKintoneTest-23.csv"
    Then I should get the exit code is zero
    And The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-24 Should return the error message when importing records with draft API Token
    Given The csv file "tmp/CliKintoneTest-24.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_DRAFT_TOKEN_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_DRAFT_API_TOKEN_FOR_IMPORT --file-path tmp/CliKintoneTest-24.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-25 Should return the error message when importing records with two valid API Token
    Given The csv file "tmp/CliKintoneTest-25.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_IMPORT,$$TEST_KINTONE_API_TOKEN_1_FOR_IMPORT --file-path tmp/CliKintoneTest-25.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400\] \[GAIA_DA03\] You cannot specify a duplicate API token for the same app."

  Scenario: CliKintoneTest-26 Should import the records successfully with two valid API Token in different apps
    Given The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" with "$$TEST_KINTONE_API_TOKEN_FOR_IMPORT_DELETE" has no records
    And The csv file "tmp/CliKintoneTest-26.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_IMPORT,$$TEST_KINTONE_API_TOKEN_FOR_EXPORT --file-path tmp/CliKintoneTest-26.csv"
    Then I should get the exit code is zero
    And The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
