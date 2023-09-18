Feature: cli-kintone export command

  Scenario: CliKintoneTest-81 Should return the record contents in CSV format
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_EXPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_EXPORT"
    Then I should get the exit code is zero
    And The header row of the output message should match with the pattern: "\"Record_number\",\"Text\",\"Number\""
    And The output message should match with the pattern: "\"1\",\"Alice\",\"10\""
    And The output message should match with the pattern: "\"2\",\"Bob\",\"20\""
    And The output message should match with the pattern: "\"3\",\"Jenny\",\"30\""
