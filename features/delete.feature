Feature: cli-kintone delete command

  Scenario: CliKintoneTest-19 Should delete all records of a specified Kintone app
    Given The app "$$TEST_KINTONE_APP_ID_FOR_DELETE" with "$$TEST_KINTONE_API_TOKEN_FOR_DELETE" has no records
    And The app "$$TEST_KINTONE_APP_ID_FOR_DELETE" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    When I run the command with args "record delete --app $$TEST_KINTONE_APP_ID_FOR_DELETE --base-url $$TEST_KINTONE_BASE_URL --api-token $$TEST_KINTONE_API_TOKEN_FOR_DELETE --yes"
    Then I should get the exit code is zero
    And The app "$$TEST_KINTONE_APP_ID_FOR_DELETE" has no records
