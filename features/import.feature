Feature: cli-kintone import command

  Scenario: CliKintoneTest-23 Should import the records with API Token successfully
    Given The app "$$TEST_KINTONE_APP_ID_FOR_IMPORT" with "$$TEST_KINTONE_API_TOKEN_FOR_IMPORT_DELETE" has no records
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_IMPORT --file-path features/test_data/import/CliKintoneTest-23.csv"
    Then I should get the exit code is zero
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $$TEST_KINTONE_APP_ID_FOR_IMPORT --api-token $$TEST_KINTONE_API_TOKEN_FOR_IMPORT"
    Then The header row of the output message should match with the pattern: "\"Record_number\",\"Text\",\"Number\""
    And The output message should match with the pattern: "\"\d+\",\"Alice\",\"10\""
    And The output message should match with the pattern: "\"\d+\",\"Bob\",\"20\""
    And The output message should match with the pattern: "\"\d+\",\"Jenny\",\"30\""
