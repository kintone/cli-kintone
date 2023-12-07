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

  Scenario: CliKintoneTest-135 Should delete the specified records successfully by --file-path option.
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Lisa   | 20     |
      | Jenny  | 30     |
      | Rose   | 40     |
    And Load the record numbers of the app "app_for_delete" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-135.csv" with content as below:
      | Record_number      |
      | $RECORD_NUMBERS[0] |
      | $RECORD_NUMBERS[1] |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-135.csv"
    Then I should get the exit code is zero
    And The app "app_for_delete" should have 2 records
    And The app "app_for_delete" should have records as below:
      | Record_number      | Text  | Number |
      | $RECORD_NUMBERS[2] | Jenny | 30     |
      | $RECORD_NUMBERS[3] | Rose  | 40     |

  Scenario: CliKintoneTest-136 Should return the error message when deleting records with a lacking value of --file-path option.
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Not enough arguments following: file-path"

  Scenario: CliKintoneTest-137 Should return the error message when deleting records with a non-existent file.
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path non_existent_file.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open '(.*)non_existent_file.csv'"

  Scenario: CliKintoneTest-138 Should return the error message when deleting records with an unsupported file.
    Given I have a file "unsupported_delete_file.txt" with content: "Record_number"
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path unsupported_delete_file.txt"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Unexpected file type: txt is unacceptable."
