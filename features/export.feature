@isolated
Feature: cli-kintone export command

  Scenario: CliKintoneTest-81 Should return the record contents in CSV format
    Given The app "app_for_export" has no records
    And The app "app_for_export" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of app "app_for_export" as env var: "APP_ID"
    And Load app token of app "app_for_export" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN"
    Then I should get the exit code is zero
    And The header row of the output message should match with the pattern: "\"Record_number\",\"Text\",\"Number\""
    And The output message should match with the pattern: "\"\d+\",\"Alice\",\"10\""
    And The output message should match with the pattern: "\"\d+\",\"Bob\",\"20\""
    And The output message should match with the pattern: "\"\d+\",\"Jenny\",\"30\""
