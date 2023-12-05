@isolated
Feature: cli-kintone export command

  Scenario: CliKintoneTest-78 Should return the error message when the user has no privilege to view records.
    Given Load app ID of the app "app_for_export" as env var: "APP_ID"
    And Load username and password of the app "app_for_export" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403] \[CB_NO02] No privilege to proceed."

  Scenario: CliKintoneTest-79 Should return the record contents in CSV format of the app in a space.
    Given The app "app_in_space" has no records
    And The app "app_in_space" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_in_space" as env var: "APP_ID"
    And Load app token of the app "app_in_space" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN"
    Then I should get the exit code is zero
    And The output message should match with the data below:
      | Record_number | Text  | Number |
      | \d+           | Alice | 10     |
      | \d+           | Bob   | 20     |
      | \d+           | Jenny | 30     |

  Scenario: CliKintoneTest-80 Should return the record contents in CSV format with an invalid --api-token and a valid --username/--password.
    Given The app "app_for_export" has no records
    And The app "app_for_export" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_export" as env var: "APP_ID"
    And Load username and password of the app "app_for_export" with exact permissions "view" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token INVALID_API_TOKEN --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is zero
    And The output message should match with the data below:
      | Record_number | Text  | Number |
      | \d+           | Alice | 10     |
      | \d+           | Bob   | 20     |
      | \d+           | Jenny | 30     |

  Scenario: CliKintoneTest-81 Should return the record contents in CSV format.
    Given The app "app_for_export" has no records
    And The app "app_for_export" has some records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_export" as env var: "APP_ID"
    And Load app token of the app "app_for_export" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN"
    Then I should get the exit code is zero
    And The header row of the output message should match with the pattern: "\"Record_number\",\"Text\",\"Number\""
    And The output message should match with the data below:
      | Record_number | Text  | Number |
      | \d+           | Alice | 10     |
      | \d+           | Bob   | 20     |
      | \d+           | Jenny | 30     |

  Scenario: CliKintoneTest-82 Should return the error message when exporting the record with a draft API Token.
    Given Load app ID of the app "app_for_draft_token" as env var: "APP_ID"
    And Load app token of the app "app_for_draft_token" with exact permissions "view" as env var: "DRAFT_API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $DRAFT_API_TOKEN"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-83 Should return the error message when exporting the record with a non-relevant API Token.
    Given Load app ID of the app "app_for_export" as env var: "APP_ID"
    And Load app token of the app "app_for_export" with exact permissions "add" as env var: "NON_RELEVANT_API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $NON_RELEVANT_API_TOKEN"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[403] \[GAIA_NO01] Using this API token, you cannot run the specified API."

  Scenario: CliKintoneTest-84 Should return the error message when exporting the record with duplicated API Tokens in same app.
    Given Load app ID of the app "app_for_export" as env var: "APP_ID"
    And Load app token of the app "app_for_export" with exact permissions "add" as env var: "API_TOKEN_1"
    And Load app token of the app "app_for_export" with exact permissions "view" as env var: "API_TOKEN_2"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_1,$API_TOKEN_2"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_DA03] You cannot specify a duplicate API token for the same app."

  Scenario: CliKintoneTest-85 Should return the record contents with two valid API tokens in different apps.
    Given The app "app_for_export" has no records
    And The app "app_for_export" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_export" as env var: "APP_ID"
    And Load app token of the app "app_for_export" with exact permissions "view" as env var: "API_TOKEN_1"
    And Load app token of the app "app_for_import" with exact permissions "view,add" as env var: "API_TOKEN_2"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_1,$API_TOKEN_2"
    Then I should get the exit code is zero
    And The output message should match with the data below:
      | Record_number | Text  | Number |
      | \d+           | Alice | 10     |
      | \d+           | Bob   | 20     |
      | \d+           | Jenny | 30     |

  Scenario: CliKintoneTest-86 Should return the error message when exporting the record with multiple API tokens, including a valid API token and an invalid API token.
    Given Load app ID of the app "app_for_export" as env var: "APP_ID"
    And Load app token of the app "app_for_export" with exact permissions "view" as env var: "API_TOKEN_1"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_1,INVALID_API_TOKEN"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-90 Should return the record contents and download attachments successfully with an existing directory.
    Given The app "app_for_export_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And The app "app_for_export_attachments" has some records with attachments in directory "attachments" as below:
      | Text  | Attachment |
      | Alice | file1.txt  |
    And Load the record numbers of the app "app_for_export_attachments" as variable: "RECORD_NUMBERS"
    And Load app ID of the app "app_for_export_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_export_attachments" with exact permissions "view" as env var: "API_TOKEN"
    And I have a directory "exported-attachments"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir exported-attachments"
    Then I should get the exit code is zero
    # [\/\\\\] is used to match both Windows and Unix path separators
    And The output message should match with the data below:
      | Record_number      | Text  | Attachment                                      |
      | $RECORD_NUMBERS[0] | Alice | Attachment-$RECORD_NUMBERS[0][\/\\\\]file1.txt  |
    And The directory "exported-attachments" should contain files as below:
      | FilePath                      | FileName  | Content |
      | Attachment-$RECORD_NUMBERS[0] | file1.txt | 123     |

  Scenario: CliKintoneTest-91 Should return the record contents and download attachments successfully with a non-existent directory.
    Given The app "app_for_export_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And The app "app_for_export_attachments" has some records with attachments in directory "attachments" as below:
      | Text  | Attachment |
      | Alice | file1.txt  |
    And Load the record numbers of the app "app_for_export_attachments" as variable: "RECORD_NUMBERS"
    And Load app ID of the app "app_for_export_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_export_attachments" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir new-directory"
    Then I should get the exit code is zero
    And The output message should match with the data below:
      | Record_number      | Text  | Attachment                                     |
      | $RECORD_NUMBERS[0] | Alice | Attachment-$RECORD_NUMBERS[0][\/\\\\]file1.txt |
    And The directory "new-directory" should contain files as below:
      | FilePath                      | FileName  | Content |
      | Attachment-$RECORD_NUMBERS[0] | file1.txt | 123     |

  Scenario: CliKintoneTest-92 Should return the record contents and download attachments successfully with attachments in different records.
    Given The app "app_for_export_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "abc"
    And The app "app_for_export_attachments" has some records with attachments in directory "attachments" as below:
      | Text  | Attachment |
      | Alice | file1.txt  |
      | Bob   | file2.txt  |
    And Load the record numbers of the app "app_for_export_attachments" as variable: "RECORD_NUMBERS"
    And Load app ID of the app "app_for_export_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_export_attachments" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir exported-attachments"
    Then I should get the exit code is zero
    And The output message should match with the data below:
      | Record_number      | Text  | Attachment                                     |
      | $RECORD_NUMBERS[0] | Alice | Attachment-$RECORD_NUMBERS[0][\/\\\\]file1.txt |
      | $RECORD_NUMBERS[1] | Bob   | Attachment-$RECORD_NUMBERS[1][\/\\\\]file2.txt |
    And The directory "exported-attachments" should contain files as below:
      | FilePath                      | FileName  | Content |
      | Attachment-$RECORD_NUMBERS[0] | file1.txt | 123     |
      | Attachment-$RECORD_NUMBERS[1] | file2.txt | abc     |

  Scenario: CliKintoneTest-93 Should return the record contents and download attachments successfully with attachments in a record.
    Given The app "app_for_export_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "abc"
    And The app "app_for_export_attachments" has some records with attachments in directory "attachments" as below:
      | Text  | Attachment            |
      | Alice | file1.txt\nfile2.txt  |
    And Load the record numbers of the app "app_for_export_attachments" as variable: "RECORD_NUMBERS"
    And Load app ID of the app "app_for_export_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_export_attachments" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir exported-attachments"
    Then I should get the exit code is zero
    And The output message should match with the data below:
      | Record_number      | Text  | Attachment                                                                                     |
      | $RECORD_NUMBERS[0] | Alice | Attachment-$RECORD_NUMBERS[0][\/\\\\]file1.txt\nAttachment-$RECORD_NUMBERS[0][\/\\\\]file2.txt |
    And The directory "exported-attachments" should contain files as below:
      | FilePath                      | FileName  | Content |
      | Attachment-$RECORD_NUMBERS[0] | file1.txt | 123     |
      | Attachment-$RECORD_NUMBERS[0] | file2.txt | abc     |

  Scenario: CliKintoneTest-94 Should return the record contents and download attachments successfully with a TXT file.
    Given The app "app_for_export_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And The app "app_for_export_attachments" has some records with attachments in directory "attachments" as below:
      | Text  | Attachment |
      | Alice | file1.txt  |
    And Load the record numbers of the app "app_for_export_attachments" as variable: "RECORD_NUMBERS"
    And Load app ID of the app "app_for_export_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_export_attachments" with exact permissions "view" as env var: "API_TOKEN"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir exported-attachments"
    Then I should get the exit code is zero
    And The output message should match with the data below:
      | Record_number      | Text  | Attachment                                     |
      | $RECORD_NUMBERS[0] | Alice | Attachment-$RECORD_NUMBERS[0][\/\\\\]file1.txt |
    And The directory "exported-attachments" should contain files as below:
      | FilePath                      | FileName  | Content |
      | Attachment-$RECORD_NUMBERS[0] | file1.txt | 123     |
