@isolated
@delete
Feature: record delete

  @serial(app_for_delete)
  Scenario: API token does not have delete permission
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403] \[GAIA_NO01] Using this API token, you cannot run the specified API."

  @serial(app_in_space_for_delete)
  Scenario: App in a space
    Given The app "app_in_space_for_delete" has no records
    And The app "app_in_space_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_in_space_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_in_space_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes"
    Then I should get the exit code is zero
    And The app "app_in_space_for_delete" should have no records

  @serial(app_for_delete)
  Scenario: API token and login information
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    And Load username and password of the app "app_for_delete" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN --yes"
    Then I should get the exit code is zero
    And The app "app_for_delete" should have no records

  @serial(app_for_delete)
  Scenario: Delete all records
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

  Scenario: API token is a draft
    Given Load app ID of the app "app_for_draft_token" as env var: "APP_ID"
    And Load app token of the app "app_for_draft_token" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

  Scenario: A duplicate API token for the same app
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN_1"
    And Load app token of the app "app_for_delete" with exact permissions "view,add,delete" as env var: "API_TOKEN_2"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN_1,$API_TOKEN_2 --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_DA03] You cannot specify a duplicate API token for the same app."

  @serial(app_for_delete)
  Scenario: API tokens for different apps
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

  Scenario: Valid and invalid API tokens
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN,INVALID_API_TOKEN_2 --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

  Scenario: Login authentication is not supported
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load username and password of the app "app_for_delete" with exact permissions "view,delete" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown arguments: username, password"

  @serial(app_for_delete)
  Scenario: Specify records with a file
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Lisa  | 20     |
      | Jenny | 30     |
      | Rose  | 40     |
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

  Scenario: File path is not specified
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Not enough arguments following: file-path"

  Scenario: File does not exist
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path non_existent_file.csv"
    Then I should get the exit code is non-zero
    # Specifying (.*) to ignore the absolute path of the file on Windows
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open '(.*)non_existent_file.csv'"

  Scenario: Unsupported file type
    Given I have a file "unsupported_delete_file.txt" with content: "Record_number"
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path unsupported_delete_file.txt"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Unexpected file type: txt is unacceptable."

  @serial(app_has_changed_record_number)
  Scenario: Specify record number with customized field code
    Given The app "app_has_changed_record_number" has no records
    And The app "app_has_changed_record_number" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Lisa  | 20     |
      | Jenny | 30     |
      | Rose  | 40     |
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

  @serial(app_for_delete)
  Scenario: Specified record does not exist
    Given The app "app_for_delete" has no records
    And The CSV file "CliKintoneTest-140.csv" with content as below:
      | Record_number |
      | 0             |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-140.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Not exists record number. ID: 0"

  @serial(app_has_set_app_code)
  Scenario: Specify with app code and record number
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

  @serial(app_has_set_app_code)
  Scenario: Specify without app code
    Given The app "app_has_set_app_code" has no records
    And The app "app_has_set_app_code" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Lisa  | 20     |
      | Jenny | 30     |
      | Rose  | 40     |
    And Load the record numbers of the app "app_has_set_app_code" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-142.csv" with content as below:
      | Record_number      |
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

  @serial(app_has_set_app_code)
  Scenario: Specify with incorrect app code
    Given The CSV file "CliKintoneTest-143.csv" with content as below:
      | Record_number        |
      | NonExistentAppCode-1 |
    And Load app ID of the app "app_has_set_app_code" as env var: "APP_ID"
    And Load app token of the app "app_has_set_app_code" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-143.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Invalid record number. ID: NonExistentAppCode-1"

  @serial(app_for_delete)
  Scenario: Skip confirmation message
    Given The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN -y"
    Then I should get the exit code is zero
    And The app "app_for_delete" should have no records

  @serial(app_in_guest_space)
  Scenario: App in a guest space (record delete)
    Given The app "app_in_guest_space" has no records
    And The app "app_in_guest_space" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load app token of the app "app_in_guest_space" with exact permissions "view,delete" as env var: "API_TOKEN"
    And Load guest space ID of the app "app_in_guest_space" as env var: "GUEST_SPACE_ID"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --guest-space-id $GUEST_SPACE_ID"
    Then I should get the exit code is zero
    And The app "app_in_guest_space" should have no records

  Scenario: Incorrect guest space ID
    Given Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load app token of the app "app_in_guest_space" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --guest-space-id 1"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403] \[CB_NO02] No privilege to proceed.."

  @serial(app_for_delete_encoding)
  Scenario: Utf8 encoded file
    Given The app "app_for_delete_encoding" has no records
    And The app "app_for_delete_encoding" has some records as below:
      | 文字列__1行_ |
      | Alice    |
      | Lisa     |
      | Jenny    |
      | Rose     |
    And Load the record numbers with field code "レコード番号" of the app "app_for_delete_encoding" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-151.csv" with "utf8" encoded content as below:
      | レコード番号             |
      | $RECORD_NUMBERS[0] |
      | $RECORD_NUMBERS[1] |
    And Load app ID of the app "app_for_delete_encoding" as env var: "APP_ID"
    And Load app token of the app "app_for_delete_encoding" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-151.csv --encoding utf8"
    Then I should get the exit code is zero
    And The app "app_for_delete_encoding" with the record number field code "レコード番号" should have 2 records
    And The app "app_for_delete_encoding" should have records as below:
      | レコード番号             | 文字列__1行_ |
      | $RECORD_NUMBERS[2] | Jenny    |
      | $RECORD_NUMBERS[3] | Rose     |

  @serial(app_for_delete_encoding)
  Scenario: Sjis encoded file
    Given The app "app_for_delete_encoding" has no records
    And The app "app_for_delete_encoding" has some records as below:
      | 文字列__1行_ |
      | Alice    |
      | Lisa     |
      | Jenny    |
      | Rose     |
    And Load the record numbers with field code "レコード番号" of the app "app_for_delete_encoding" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-152.csv" with "sjis" encoded content as below:
      | レコード番号             |
      | $RECORD_NUMBERS[0] |
      | $RECORD_NUMBERS[1] |
    And Load app ID of the app "app_for_delete_encoding" as env var: "APP_ID"
    And Load app token of the app "app_for_delete_encoding" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-152.csv --encoding sjis"
    Then I should get the exit code is zero
    And The app "app_for_delete_encoding" with the record number field code "レコード番号" should have 2 records
    And The app "app_for_delete_encoding" should have records as below:
      | レコード番号             | 文字列__1行_ |
      | $RECORD_NUMBERS[2] | Jenny    |
      | $RECORD_NUMBERS[3] | Rose     |

  Scenario: Specify utf8 with sjis encoded file
    Given The CSV file "CliKintoneTest-153.csv" with "sjis" encoded content as below:
      | レコード番号 |
      | 1      |
    And Load app ID of the app "app_for_delete_encoding" as env var: "APP_ID"
    And Load app token of the app "app_for_delete_encoding" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-153.csv --encoding utf8"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: The specified encoding \(utf8\) might mismatch the actual encoding of the CSV file."

  Scenario: Specify sjis with utf8 encoded file
    Given The CSV file "CliKintoneTest-154.csv" with "utf8" encoded content as below:
      | レコード番号 |
      | 1      |
    And Load app ID of the app "app_for_delete_encoding" as env var: "APP_ID"
    And Load app token of the app "app_for_delete_encoding" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-154.csv --encoding sjis"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: The record number field code \(レコード番号\) is not found."

  Scenario: Unsupported encoding
    Given The CSV file "CliKintoneTest-155.csv" with "utf8" encoded content as below:
      | レコード番号 |
      | 1      |
    And Load app ID of the app "app_for_delete_encoding" as env var: "APP_ID"
    And Load app token of the app "app_for_delete_encoding" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-155.csv --encoding unsupported_encoding"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Argument: encoding, Given: \"unsupported_encoding\", Choices: \"utf8\", \"sjis\""

  @serial(app_for_delete)
  Scenario: App does not have records
    Given The app "app_for_delete" has no records
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN --yes"
    Then I should get the exit code is zero
    And The output error message should match with the pattern: "WARN: The specified app does not have any records."

  @serial(app_for_delete)
  Scenario: Cancel the execution by pressing "N"
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with a prompt with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN"
    And I type "N"
    And I press Enter
    Then I should get the exit code is zero
    And The app "app_for_delete" should have 3 records
    And The app "app_for_delete" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  @serial(app_for_delete)
  Scenario: Proceed with the execution by pressing "Y"
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with a prompt with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN"
    And I type "Y"
    And I press Enter
    Then I should get the exit code is zero
    And The app "app_for_delete" should have no records

  @serial(app_for_delete)
  Scenario: Unsupported character for confirmation message
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with a prompt with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN"
    And I type "abc"
    And I press Enter
    Then I should get the exit code is zero
    And The app "app_for_delete" should have 3 records
    And The app "app_for_delete" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  @serial(app_for_delete)
  Scenario: Press Enter for confirmation message
    Given Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And The app "app_for_delete" has no records
    And The app "app_for_delete" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with a prompt with args "record delete --app $APP_ID --base-url $$TEST_KINTONE_BASE_URL --api-token $API_TOKEN"
    And I press Enter
    Then I should get the exit code is zero
    And The app "app_for_delete" should have 3 records
    And The app "app_for_delete" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Record number is not specified in a file
    Given The CSV file "CliKintoneTest-171.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_delete" as env var: "APP_ID"
    And Load app token of the app "app_for_delete" with exact permissions "view,delete" as env var: "API_TOKEN"
    When I run the command with args "record delete --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --yes --file-path CliKintoneTest-171.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: The record number field code \(Record_number\) is not found."
