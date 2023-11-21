@isolated
Feature: cli-kintone import command

  Scenario: CliKintoneTest-23 Should import the records with API Token successfully
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-23.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-23.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-20 Should return the error message when the user has no privilege to add records
    Given The csv file "CliKintoneTest-20.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $$TEST_KINTONE_USERNAME_UNPRIVILEGED --password $$TEST_KINTONE_PASSWORD_UNPRIVILEGED --file-path CliKintoneTest-20.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403\] \[CB_NO02\] No privilege to proceed."

  Scenario: CliKintoneTest-21 Should import records to app in space successfully
    Given The app "app_in_space" has no records
    And The csv file "CliKintoneTest-21.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of app "app_in_space" as env var: "APP_ID"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --file-path CliKintoneTest-21.csv"
    Then I should get the exit code is zero
    And The app "app_in_space" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-22 Should import records to app with --api-token and --username, --password successfully
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-22.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD --file-path CliKintoneTest-22.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-24 Should return the error message when importing records with draft API Token
    Given The csv file "CliKintoneTest-24.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of app "app_for_draft_token" as env var: "APP_ID"
    And Load app token of app "app_for_draft_token" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-24.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-25 Should return the error message when importing records with two valid API Token
    Given The csv file "CliKintoneTest-25.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_1"
    And Load app token of app "app_for_import" with exact permissions "view,add" as env var: "API_TOKEN_2"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_1,$API_TOKEN_2 --file-path CliKintoneTest-25.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400\] \[GAIA_DA03\] You cannot specify a duplicate API token for the same app."

  Scenario: CliKintoneTest-26 Should import the records successfully with two valid API Token in different apps
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-26.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    And Load app token of app "app_for_export" with exact permissions "view" as env var: "API_TOKEN_EXPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT,$API_TOKEN_EXPORT --file-path CliKintoneTest-26.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-27 Should return the error message when importing records with valid and invalid API Tokens
    Given The csv file "CliKintoneTest-27.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT,invalid_token --file-path CliKintoneTest-27.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-28 Should return the error message when importing records with an API Token without Add permission
    Given The csv file "CliKintoneTest-28.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "view" as env var: "API_TOKEN_VIEW"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_VIEW --file-path CliKintoneTest-28.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[403\] \[GAIA_NO01\] Using this API token, you cannot run the specified API."

  Scenario: CliKintoneTest-29 Should return the error message when updating records with an API Token without View/Edit permission
    Given The csv file "CliKintoneTest-29.csv" with content as below:
      | Text   | Number |
      | Alice  | 11     |
    And The app "app_for_import" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --file-path CliKintoneTest-29.csv --update-key Record_number"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[403\] \[GAIA_NO01\] Using this API token, you cannot run the specified API."

  Scenario: CliKintoneTest-33 Should import the records successfully with --attachments-dir specified and no attachments fields.
    Given The csv file "CliKintoneTest-33.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./ --file-path CliKintoneTest-33.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-34 Should import the records successfully with --attachments-dir specified and no attachments fields.
    Given The csv file "CliKintoneTest-34.csv" with content as below:
      | Text   | Number | Attachment         |
      | Alice  | 10     | non_exist_file.txt |
      | Bob    | 20     | non_exist_file.txt |
      | Jenny  | 30     | non_exist_file.txt |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./ --file-path CliKintoneTest-34.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open 'non_exist_file.txt'"

  Scenario: CliKintoneTest-35 Should import the records successfully with attachments.
    Given The app "app_for_import" has no records
    And There is a file "attachments/file1.txt" with content: "123"
    And There is a file "attachments/file2.txt" with content: "abc"
    And There is a file "attachments/file3.txt" with content: "!!!"
    And The csv file "CliKintoneTest-35.csv" with content as below:
      | Text   | Number | Attachment |
      | Alice  | 10     | file1.txt\nfile3.txt  |
      | Lisa   | 10     | file2.txt  |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./attachments --file-path CliKintoneTest-35.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number | Attachment |
      | Alice  | 10     | file1.txt\nfile3.txt  |
      | Lisa   | 10     | file2.txt  |
    And The app "app_for_import" should has attachments in "attachments" as below:
      | RecordIndex   | File       | Content |
      | 0             | file1.txt  | 123     |
      | 0             | file3.txt  | !!!     |
      | 1             | file2.txt  | abc     |

  Scenario: CliKintoneTest-36 Should return the error message when importing records with non-exist directory name
    Given The csv file "CliKintoneTest-36.csv" with content as below:
      | Text   | Number | Attachment        |
      | Alice  | 10     | no_exist_file.txt |
    And Load app ID of app "app_for_import" as env var: "APP_ID"
    And Load app token of app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./non-exist-dir --file-path CliKintoneTest-36.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open 'non-exist-dir/no_exist_file.txt'"
