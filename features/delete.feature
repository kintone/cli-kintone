@isolated
Feature: cli-kintone delete command

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

  Scenario: CliKintoneTest-128 Should delete records when specifying an API Token and including username/password.
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    And Load username and password of the app "app_for_delete" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is zero
    And The app "app_for_delete" should have no records

  Scenario: CliKintoneTest-129 Should delete all records of a specified app
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

  Scenario: CliKintoneTest-130 Should return the error message when deleting the record with a draft API Token.
    Given Load app ID of the app "app_for_draft_token" as env var: "APP_ID"
    And Load app token of the app "app_for_draft_token" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-131 Should return the error message when deleting records with two valid API Token.
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN_1"
    And Load app token of the app "app_for_delete" with exact permissions "view,add,delete" as env var: "API_TOKEN_2"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN_1,$API_TOKEN_2 --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_DA03] You cannot specify a duplicate API token for the same app."

  Scenario: CliKintoneTest-132 Should delete records of specified app successfully with two valid API Tokens in different apps.
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN_1"
    And Load app token of the app "app_for_export" with exact permissions "view" as env var: "API_TOKEN_2"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN_1,$API_TOKEN_2 --yes"
    Then I should get the exit code is zero
    And The app "app_for_delete" should have no records

  Scenario: CliKintoneTest-133 Should return the error message when deleting records with valid and invalid API Tokens.
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN,INVALID_API_TOKEN_2 --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

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

  Scenario: CliKintoneTest-139 Should delete the records of the app in which the Record_number field code has been changed.
    Given The app "app_has_changed_record_number" has no records
    And The app "app_has_changed_record_number" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Lisa   | 20     |
      | Jenny  | 30     |
      | Rose   | 40     |
    And Load the record numbers with field code "Cybozu_record_number" of the app "app_has_changed_record_number" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-139.csv" with content as below:
      | Cybozu_record_number |
      | $RECORD_NUMBERS[0]   |
      | $RECORD_NUMBERS[1]   |
    And Load app ID of the app "app_has_changed_record_number" as env var: "APP_ID"
    And Load app token of the app "app_has_changed_record_number" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-139.csv"
    Then I should get the exit code is zero
    And The app "app_has_changed_record_number" with the record number field code "Cybozu_record_number" should have 2 records
    And The app "app_has_changed_record_number" should have records as below:
      | Cybozu_record_number | Text  | Number |
      | $RECORD_NUMBERS[2]   | Jenny | 30     |
      | $RECORD_NUMBERS[3]   | Rose  | 40     |

  Scenario: CliKintoneTest-140 Should return the error message when deleting records with non-existent record number.
    Given The app "app_for_delete" has no records
    And The CSV file "CliKintoneTest-140.csv" with content as below:
      | Record_number |
      | 0             |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-140.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Not exists record number. ID: 0"

  Scenario: CliKintoneTest-141 Should delete the records of the app that have set the App Code, and the Record_number contains the App Code.
    Given The app "app_has_set_app_code" has no records
    And The app "app_has_set_app_code" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Lisa  | 20     |
      | Jenny | 30     |
      | Rose  | 40     |
    And Load the record numbers of the app "app_has_set_app_code" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-141.csv" with content as below:
      | Record_number            |
      | MyApp-$RECORD_NUMBERS[0] |
      | MyApp-$RECORD_NUMBERS[1] |
    And Load app ID of the app "app_has_set_app_code" as env var: "APP_ID"
    And Load app token of the app "app_has_set_app_code" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-141.csv"
    Then I should get the exit code is zero
    And The app "app_has_set_app_code" should have 2 records
    And The app "app_has_set_app_code" should have records as below:
      | Record_number            | Text  | Number |
      | MyApp-$RECORD_NUMBERS[2] | Jenny | 30     |
      | MyApp-$RECORD_NUMBERS[3] | Rose  | 40     |

  Scenario: CliKintoneTest-142 Should delete the records of the app that have set the App Code, and the Record_number does not contain the App Code.
    Given The app "app_has_set_app_code" has no records
    And The app "app_has_set_app_code" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Lisa  | 20     |
      | Jenny | 30     |
      | Rose  | 40     |
    And Load the record numbers of the app "app_has_set_app_code" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-142.csv" with content as below:
      | Record_number            |
      | $RECORD_NUMBERS[0] |
      | $RECORD_NUMBERS[1] |
    And Load app ID of the app "app_has_set_app_code" as env var: "APP_ID"
    And Load app token of the app "app_has_set_app_code" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-142.csv"
    Then I should get the exit code is zero
    And The app "app_has_set_app_code" should have 2 records
    And The app "app_has_set_app_code" should have records as below:
      | Record_number            | Text  | Number |
      | MyApp-$RECORD_NUMBERS[2] | Jenny | 30     |
      | MyApp-$RECORD_NUMBERS[3] | Rose  | 40     |

  Scenario: CliKintoneTest-143 Should return the error message when deleting records with incorrect App Code.
    Given The CSV file "CliKintoneTest-143.csv" with content as below:
      | Record_number        |
      | NonExistentAppCode-1 |
    And Load app ID of the app "app_has_set_app_code" as env var: "APP_ID"
    And Load app token of the app "app_has_set_app_code" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-143.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Invalid record number. ID: NonExistentAppCode-1"

  Scenario: CliKintoneTest-171 Should return the error message when the record number field code does not exist in the CSV file.
    Given The CSV file "CliKintoneTest-171.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-171.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: The record number field code \(Record_number\) is not found."
