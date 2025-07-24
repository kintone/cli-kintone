@isolated
@import
Feature: record import

  Scenario: API token authorization
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-23.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-23.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: User does not have privilege to add records
    Given The CSV file "CliKintoneTest-20.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "view" as env vars: "UNPRIVILEGED_USERNAME" and "UNPRIVILEGED_PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $UNPRIVILEGED_USERNAME --password $UNPRIVILEGED_PASSWORD --file-path CliKintoneTest-20.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403] \[CB_NO02] No privilege to proceed."

  Scenario: App in a space
    Given The app "app_in_space_for_import" has no records
    And The CSV file "CliKintoneTest-21.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_in_space_for_import" as env var: "APP_ID"
    And Load app token of the app "app_in_space_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-21.csv"
    Then I should get the exit code is zero
    And The app "app_in_space_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Invalid API token and valid login information
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-22.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token INVALID_API_TOKEN --username $USERNAME --password $PASSWORD --file-path CliKintoneTest-22.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: API token is a draft
    Given The CSV file "CliKintoneTest-24.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_draft_token" as env var: "APP_ID"
    And Load app token of the app "app_for_draft_token" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-24.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

  Scenario: A duplicate API token for the same app
    Given The CSV file "CliKintoneTest-25.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_1"
    And Load app token of the app "app_for_import" with exact permissions "view,add" as env var: "API_TOKEN_2"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_1,$API_TOKEN_2 --file-path CliKintoneTest-25.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_DA03] You cannot specify a duplicate API token for the same app."

  Scenario: API tokens for different apps
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-26.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    And Load app token of the app "app_for_export" with exact permissions "view" as env var: "API_TOKEN_EXPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT,$API_TOKEN_EXPORT --file-path CliKintoneTest-26.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Valid and invalid API tokens
    Given The CSV file "CliKintoneTest-27.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT,invalid_token --file-path CliKintoneTest-27.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400] \[GAIA_IA02] The specified API token does not match the API token generated via an app."

  Scenario: API token does not have privilege to add records
    Given The CSV file "CliKintoneTest-28.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "view" as env var: "API_TOKEN_VIEW"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_VIEW --file-path CliKintoneTest-28.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[403] \[GAIA_NO01] Using this API token, you cannot run the specified API."

  Scenario: API token does not have privilege to view and edit records
    Given The app "app_for_import" has some records as below:
      | Text  | Number |
      | Alice | 10     |
    And The CSV file "CliKintoneTest-29.csv" with content as below:
      | Record_number | Text  | Number |
      |               | Alice | 11     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --file-path CliKintoneTest-29.csv --update-key Record_number"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[403] \[GAIA_NO01] Using this API token, you cannot run the specified API."

  Scenario: Login authorization
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-30.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD --file-path CliKintoneTest-30.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Login authorization - short username option
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-31.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID -u $USERNAME --password $PASSWORD --file-path CliKintoneTest-31.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Login authorization - short password option
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-32.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME -p $PASSWORD --file-path CliKintoneTest-32.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Specify attachments directory nevertheless app does not have an attachment field
    Given The CSV file "CliKintoneTest-33.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./ --file-path CliKintoneTest-33.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Specified attachment file does not exist
    Given The CSV file "CliKintoneTest-34.csv" with content as below:
      | Text  | Number | Attachment         |
      | Alice | 10     | non_exist_file.txt |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./ --file-path CliKintoneTest-34.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open '(.*)non_exist_file.txt'"

  Scenario: Record with an attachment file
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And The CSV file "CliKintoneTest-35.csv" with content as below:
      | Text  | Number | Attachment |
      | Alice | 10     | file1.txt  |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./attachments --file-path CliKintoneTest-35.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should have records as below:
      | Text  | Number | Attachment |
      | Alice | 10     | file1.txt  |
    And The app "app_for_import_attachments" should have attachments as below:
      | RecordIndex | AttachmentFieldCode | File      | Content |
      | 0           | Attachment          | file1.txt | 123     |

  Scenario: Specified attachment directory does not exist
    Given The CSV file "CliKintoneTest-36.csv" with content as below:
      | Text  | Number | Attachment        |
      | Alice | 10     | no_exist_file.txt |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./non-exist-dir-c1aceeba-f3e0-45ab-8231-7729d4bc03a0 --file-path CliKintoneTest-36.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open '(.*)non-exist-dir-c1aceeba-f3e0-45ab-8231-7729d4bc03a0[\/\\]+no_exist_file.txt'"

  Scenario: Multiple attachments on a field
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "abc"
    And The CSV file "CliKintoneTest-37.csv" with content as below:
      | Text  | Attachment           |
      | Alice | file1.txt\nfile2.txt |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-37.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should have records as below:
      | Text  | Attachment           |
      | Alice | file1.txt\nfile2.txt |
    And The app "app_for_import_attachments" should have attachments as below:
      | RecordIndex | AttachmentFieldCode | File      | Content |
      | 0           | Attachment          | file1.txt | 123     |
      | 0           | Attachment          | file2.txt | abc     |

  Scenario: Attachments on multiple fields
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "456"
    And I have a file "attachments/file3.txt" with content: "abc"
    And I have a file "attachments/file4.txt" with content: "xyz"
    And The CSV file "CliKintoneTest-38.csv" with content as below:
      | Text  | Attachment           | Attachment_0         |
      | Alice | file1.txt\nfile2.txt | file3.txt\nfile4.txt |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-38.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should have records as below:
      | Text  | Attachment           | Attachment_0         |
      | Alice | file1.txt\nfile2.txt | file3.txt\nfile4.txt |
    And The app "app_for_import_attachments" should have attachments as below:
      | RecordIndex | AttachmentFieldCode | File      | Content |
      | 0           | Attachment          | file1.txt | 123     |
      | 0           | Attachment          | file2.txt | 456     |
      | 0           | Attachment_0        | file3.txt | abc     |
      | 0           | Attachment_0        | file4.txt | xyz     |

  Scenario: Attachments on multiple records
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "456"
    And I have a file "attachments/file3.txt" with content: "abc"
    And I have a file "attachments/file4.txt" with content: "xyz"
    And The CSV file "CliKintoneTest-39.csv" with content as below:
      | Text  | Attachment           |
      | Alice | file1.txt\nfile2.txt |
      | Lisa  | file3.txt\nfile4.txt |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-39.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should have records as below:
      | Text  | Attachment           |
      | Alice | file1.txt\nfile2.txt |
      | Lisa  | file3.txt\nfile4.txt |
    And The app "app_for_import_attachments" should have attachments as below:
      | RecordIndex | AttachmentFieldCode | File      | Content |
      | 0           | Attachment          | file1.txt | 123     |
      | 0           | Attachment          | file2.txt | 456     |
      | 1           | Attachment          | file3.txt | abc     |
      | 1           | Attachment          | file4.txt | xyz     |

  Scenario: Record with .txt file attachment
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file.txt" with content: "G3Gef76wJ5u1mPuh14QhwgeLd5eC0OHU"
    And The CSV file "CliKintoneTest-40.csv" with content as below:
      | Text  | Attachment |
      | Alice | file.txt   |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-40.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should have records as below:
      | Text  | Attachment |
      | Alice | file.txt   |
    And The app "app_for_import_attachments" should have attachments as below:
      | RecordIndex | AttachmentFieldCode | File     | Content                          |
      | 0           | Attachment          | file.txt | G3Gef76wJ5u1mPuh14QhwgeLd5eC0OHU |

  Scenario: File path is not specified
    Given Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: file-path"

  Scenario: Unsupported file type
    Given Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-41.txt"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Unexpected file type: txt is unacceptable."

  Scenario: Specified CSV does not exist
    Given Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path 9f56a2be-c8f0-4ecc-8f62-b5b430e34e25.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory"

  Scenario: Upsert by record number
    Given The app "app_for_upsert" has no records
    And The app "app_for_upsert" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
    And Load the record numbers of the app "app_for_upsert" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-44.csv" with content as below:
      | Record_number      | Text  | Number |
      | $RECORD_NUMBERS[0] | Lisa  | 30     |
      | $RECORD_NUMBERS[1] | Rose  | 40     |
      |                    | Jenny | 50     |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "view,add,edit" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --update-key Record_number --file-path CliKintoneTest-44.csv"
    Then I should get the exit code is zero
    And The app "app_for_upsert" should have 3 records
    And The app "app_for_upsert" should have records as below:
      | Record_number      | Text  | Number |
      | $RECORD_NUMBERS[0] | Lisa  | 30     |
      | $RECORD_NUMBERS[1] | Rose  | 40     |
      | \d+                | Jenny | 50     |

  Scenario: Upsert by text field
    Given The app "app_for_upsert" has no records
    And The app "app_for_upsert" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
    And Load the record numbers of the app "app_for_upsert" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-45.csv" with content as below:
      | Record_number | Text  | Number |
      |               | Alice | 30     |
      |               | Bob   | 40     |
      |               | Jenny | 50     |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "view,add,edit" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --update-key Text --file-path CliKintoneTest-45.csv"
    Then I should get the exit code is zero
    And The app "app_for_upsert" should have 3 records
    And The app "app_for_upsert" should have records as below:
      | Record_number      | Text  | Number |
      | $RECORD_NUMBERS[0] | Alice | 30     |
      | $RECORD_NUMBERS[1] | Bob   | 40     |
      | \d+                | Jenny | 50     |

  Scenario: Update-key field is not set to unique (text)
    Given The app "app_for_upsert" has no records
    And The app "app_for_upsert" has some records as below:
      | Text_Non_Prohibit_Duplicate_Values | Number |
      | Alice                              | 10     |
    And The CSV file "CliKintoneTest-46.csv" with content as below:
      | Text_Non_Prohibit_Duplicate_Values | Number |
      | Alice                              | 20     |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "view,add,edit" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --update-key Text_Non_Prohibit_Duplicate_Values --file-path CliKintoneTest-46.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Error: update key field should set to unique"

  Scenario: Update by number field
    Given The app "app_for_upsert" has no records
    And The app "app_for_upsert" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
    And Load the record numbers of the app "app_for_upsert" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-47.csv" with content as below:
      | Record_number | Text  | Number |
      |               | Lisa  | 10     |
      |               | Rose  | 20     |
      |               | Jenny | 30     |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "view,add,edit" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --update-key Number --file-path CliKintoneTest-47.csv"
    Then I should get the exit code is zero
    And The app "app_for_upsert" should have 3 records
    And The app "app_for_upsert" should have records as below:
      | Record_number      | Text  | Number |
      | $RECORD_NUMBERS[0] | Lisa  | 10     |
      | $RECORD_NUMBERS[1] | Rose  | 20     |
      | \d+                | Jenny | 30     |

  Scenario: Update-key field is not set to unique (number)
    Given The app "app_for_upsert" has no records
    And The app "app_for_upsert" has some records as below:
      | Text  | Number_Non_Prohibit_Duplicate_Values |
      | Alice | 10                                   |
    And The CSV file "CliKintoneTest-48.csv" with content as below:
      | Text | Number_Non_Prohibit_Duplicate_Values |
      | Bob  | 10                                   |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "view,add,edit" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --update-key Number_Non_Prohibit_Duplicate_Values --file-path CliKintoneTest-48.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Error: update key field should set to unique"

  Scenario: Specified update-key field is not supported
    Given The app "app_for_upsert" has no records
    And The app "app_for_upsert" has some records as below:
      | Text  | Date       |
      | Alice | 2024-01-01 |
    And The CSV file "CliKintoneTest-49.csv" with content as below:
      | Text | Date       |
      | Bob  | 2024-01-01 |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "view,add,edit" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --update-key Date --file-path CliKintoneTest-49.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Error: unsupported field type for update key"

  Scenario: API token does not have privilege to edit records
    Given The app "app_for_upsert" has no records
    And The app "app_for_upsert" has some records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
    And The CSV file "CliKintoneTest-50.csv" with content as below:
      | Text  | Number |
      | Alice | 30     |
      | Bob   | 40     |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --update-key Text --file-path CliKintoneTest-50.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[403\] \[GAIA_NO01\] Using this API token, you cannot run the specified API."

  Scenario: Specify a field
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-51.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Text --file-path CliKintoneTest-51.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice |        |
      | Bob   |        |
      | Jenny |        |

  Scenario: Specify multiple fields
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-52.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Text,Number --file-path CliKintoneTest-52.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Specified field does not exist
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-53.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Text,Non_Existent_Field_Code --file-path CliKintoneTest-53.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: The specified field \"Non_Existent_Field_Code\" does not exist on the app"

  Scenario: Specify a field in a table
    Given The app "app_for_import_table" has no records
    And The CSV file "CliKintoneTest-54.csv" with content as below:
      | * | Text_0 | Number_0 | Table | Text    | Number |
      | * | Alice  | 10       | 1     | Alice_1 | 100    |
      |   | Alice  | 10       | 2     | Alice_2 | 200    |
      | * | Bob    | 20       | 3     | Bob_1   | 300    |
      | * | Jenny  | 30       | 4     |         |        |
      | * |        |          | 5     | Michael | 400    |
    And Load app ID of the app "app_for_import_table" as env var: "APP_ID"
    And Load app token of the app "app_for_import_table" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Text,Number --file-path CliKintoneTest-54.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: The field in a Table cannot be specified to the fields option \(\"Text\"\)"

  Scenario: Specify a table
    Given The app "app_for_import_table" has no records
    And The CSV file "CliKintoneTest-55.csv" with content as below:
      | * | Text_0 | Number_0 | Table | Text    | Number |
      | * | Alice  | 10       | 1     | Alice_1 | 100    |
      |   | Alice  | 10       | 2     | Alice_2 | 200    |
      | * | Bob    | 20       | 3     | Bob     | 300    |
      | * | Jenny  | 30       | 4     | Jenny   | 400    |
      | * |        |          | 5     | Michael | 500    |
    And Load app ID of the app "app_for_import_table" as env var: "APP_ID"
    And Load app token of the app "app_for_import_table" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Table --file-path CliKintoneTest-55.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_table" with table field should have records as below:
      | * | Text_0 | Number_0 | Table | (Table.Text) | (Table.Number) |
      | * |        |          | \d+   | Alice_1      | 100            |
      |   |        |          | \d+   | Alice_2      | 200            |
      | * |        |          | \d+   | Bob          | 300            |
      | * |        |          | \d+   | Jenny        | 400            |
      | * |        |          | \d+   | Michael      | 500            |

  Scenario: App in a guest space
    Given The app "app_in_guest_space" has no records
    And The CSV file "CliKintoneTest-60.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load app token of the app "app_in_guest_space" with exact permissions "add" as env var: "API_TOKEN"
    And Load guest space ID of the app "app_in_guest_space" as env var: "GUEST_SPACE_ID"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --guest-space-id $GUEST_SPACE_ID --file-path CliKintoneTest-60.csv"
    Then I should get the exit code is zero
    And The app "app_in_guest_space" should have records as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |

  Scenario: Incorrect guest space
    Given The app "app_in_guest_space" has no records
    And The CSV file "CliKintoneTest-61.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load app token of the app "app_in_guest_space" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --guest-space-id 1 --file-path CliKintoneTest-61.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403] \[CB_NO02] No privilege to proceed."

  Scenario: Utf8 encoded file
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-62.csv" with "utf8" encoded content as below:
      | Text   | Number |
      | レコード番号 | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --encoding utf8 --file-path CliKintoneTest-62.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text   | Number |
      | レコード番号 | 10     |

  Scenario: Sjis encoded file
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-63.csv" with "sjis" encoded content as below:
      | Text | Number |
      | 作成日時 | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --encoding sjis --file-path CliKintoneTest-63.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should have records as below:
      | Text | Number |
      | 作成日時 | 10     |

  Scenario: Unsupported encoding
    Given The app "app_for_import" has no records
    And The CSV file "CliKintoneTest-64.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   | 20     |
      | Jenny | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --encoding unsupported_character_code --file-path CliKintoneTest-64.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Argument: encoding, Given: \"unsupported_character_code\", Choices: \"utf8\", \"sjis\""

  Scenario: Remove attachments by upserting
    Given The app "app_for_upsert" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "abc"
    And The app "app_for_upsert" has some records with attachments in directory "attachments" as below:
      | Text  | Number | Attachment |
      | Alice | 10     | file1.txt  |
      | Bob   | 20     | file2.txt  |
    And Load the record numbers of the app "app_for_upsert" as variable: "RECORD_NUMBERS"
    And The CSV file "CliKintoneTest-75.csv" with content as below:
      | Record_number      | Text  | Number | Attachment |
      | $RECORD_NUMBERS[0] | Lisa  | 30     |            |
      | $RECORD_NUMBERS[1] | Rose  | 40     |            |
      |                    | Jenny | 50     |            |
    And Load app ID of the app "app_for_upsert" as env var: "APP_ID"
    And Load app token of the app "app_for_upsert" with exact permissions "view,add,edit" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir attachments --update-key Record_number --file-path CliKintoneTest-75.csv"
    Then I should get the exit code is zero
    And The app "app_for_upsert" should have no attachments
    And The app "app_for_upsert" should have records as below:
      | Record_number      | Text  | Number | Attachment |
      | $RECORD_NUMBERS[0] | Lisa  | 30     |            |
      | $RECORD_NUMBERS[1] | Rose  | 40     |            |
      | \d+                | Jenny | 50     |            |

  Scenario: Record data with table fields
    Given The app "app_for_import_table" has no records
    And The CSV file "CliKintoneTest-75.csv" with content as below:
      | * | Text_0 | Number_0 | Table | Text    | Number |
      | * | Alice  | 10       | 1     | Alice_1 | 100    |
      |   | Alice  | 10       | 2     | Alice_2 | 200    |
      | * | Bob    | 20       | 3     | Bob     | 300    |
      | * | Jenny  | 30       | 4     | Jenny   | 400    |
      | * |        |          | 5     | Michael | 500    |
    And Load app ID of the app "app_for_import_table" as env var: "APP_ID"
    And Load app token of the app "app_for_import_table" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-75.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_table" with table field should have records as below:
      | * | Text_0 | Number_0 | Table | (Table.Text) | (Table.Number) |
      | * | Alice  | 10       | \d+   | Alice_1      | 100            |
      |   | Alice  | 10       | \d+   | Alice_2      | 200            |
      | * | Bob    | 20       | \d+   | Bob          | 300            |
      | * | Jenny  | 30       | \d+   | Jenny        | 400            |
      | * |        |          | \d+   | Michael      | 500            |

  Scenario: Record data with required field empty
    Given The CSV file "CliKintoneTest-77.csv" with content as below:
      | Text  | Number |
      | Alice | 10     |
      | Bob   |        |
    And Load app ID of the app "app_for_import_required_field" as env var: "APP_ID"
    And Load app token of the app "app_for_import_required_field" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-77.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[400] \[CB_VA01] Missing or invalid input."
