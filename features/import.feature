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
