@isolated
Feature: cli-kintone delete command

  Scenario: CliKintoneTest-19 Should delete all records of a specified Kintone app
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN --yes"
    Then I should get the exit code is zero
    And The app "app_for_delete" should have no records

  Scenario: CliKintoneTest-126 Should return the error message when the user has no privilege to delete records.
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403] \[GAIA_NO01] Using this API token, you cannot run the specified API."

  Scenario: CliKintoneTest-127 Should delete the records of the app in a space.
    Given The app "app_in_space" has no records
    And The app "app_in_space" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_in_space" as env var: "APP_ID"
    And Load app token of the app "app_in_space" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes"
    Then I should get the exit code is zero
    And The app "app_in_space" should have no records
