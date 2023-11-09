Feature: cli-kintone import command

  Scenario: CliKintoneTest-23 Should import the records with API Token successfully
    Given The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" with "$$TEST_KINTONE_API_TOKEN_FOR_IMPORT_DELETE" has no records
    And The csv file "tmp/CliKintoneTest-23.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_IMPORT --file-path tmp/CliKintoneTest-23.csv"
    Then I should get the exit code is zero
    And The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-20 Should return the error message when there is no privilege to add records
    Given The csv file "tmp/CliKintoneTest-20.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --username $$TEST_KINTONE_USERNAME_UNPRIVILEGED --password $$TEST_KINTONE_PASSWORD_UNPRIVILEGED --file-path tmp/CliKintoneTest-20.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403\] \[CB_NO02\] No privilege to proceed."

  Scenario: CliKintoneTest-21 Should import records to app in space successfully
    Given The app "$$TEST_KINTONE_APP_IN_SPACE_ID" with "$$TEST_KINTONE_APP_IN_SPACE_FOR_IMPORT_DELETE" has no records
    And The csv file "tmp/CliKintoneTest-21.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_IN_SPACE_ID --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --file-path tmp/CliKintoneTest-21.csv"
    Then I should get the exit code is zero
    And The app "$$TEST_KINTONE_APP_IN_SPACE_ID" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-22 Should import records to app with --api-token and --username, --password successfully
    Given The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" with "$$TEST_KINTONE_API_TOKEN_FOR_IMPORT_DELETE" has no records
    And The csv file "tmp/CliKintoneTest-22.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_IMPORT --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --file-path tmp/CliKintoneTest-21.csv"
    Then I should get the exit code is zero
    And The app "$$TEST_KINTONE_APP_IN_SPACE_ID" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
