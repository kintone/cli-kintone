Feature: cli-kintone export command

  Scenario: CliKintoneTest-81 Should return the record contents in CSV format
    Given The app "$$TEST_KINTONE_APP_ID_FOR_EXPORT" with "$$TEST_KINTONE_API_TOKEN_FOR_DELETE" has no records
    And The app "$$TEST_KINTONE_APP_ID_FOR_EXPORT" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_EXPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_EXPORT"
    Then I should get the exit code is zero
    And The header row of the output message should match with the pattern: "\"Record_number\",\"Text\",\"Number\""
    And The output message should match with the pattern: "\"\d+\",\"Alice\",\"10\""
    And The output message should match with the pattern: "\"\d+\",\"Bob\",\"20\""
    And The output message should match with the pattern: "\"\d+\",\"Jenny\",\"30\""
