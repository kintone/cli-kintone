@isolated
Feature: cli-kintone import command

  Scenario: CliKintoneTest-23 Should import the records with API Token successfully
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-23.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
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
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "view" as env vars: "UNPRIVILEGED_USERNAME" and "UNPRIVILEGED_PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $UNPRIVILEGED_USERNAME --password $UNPRIVILEGED_PASSWORD --file-path CliKintoneTest-20.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403\] \[CB_NO02\] No privilege to proceed."

  Scenario: CliKintoneTest-21 Should import records to app in space successfully
    Given The app "app_in_space" has no records
    And The csv file "CliKintoneTest-21.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_in_space" as env var: "APP_ID"
    And Load app token of the app "app_in_space" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-21.csv"
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
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token INVALID_TOKEN --username $USERNAME --password $PASSWORD --file-path CliKintoneTest-22.csv"
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
    And Load app ID of the app "app_for_draft_token" as env var: "APP_ID"
    And Load app token of the app "app_for_draft_token" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --file-path CliKintoneTest-24.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-25 Should return the error message when importing records with two valid API Token
    Given The csv file "CliKintoneTest-25.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_1"
    And Load app token of the app "app_for_import" with exact permissions "view,add" as env var: "API_TOKEN_2"
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
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    And Load app token of the app "app_for_export" with exact permissions "view" as env var: "API_TOKEN_EXPORT"
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
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT,invalid_token --file-path CliKintoneTest-27.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[520\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: CliKintoneTest-28 Should return the error message when importing records with an API Token without Add permission
    Given The csv file "CliKintoneTest-28.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "view" as env var: "API_TOKEN_VIEW"
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
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --file-path CliKintoneTest-29.csv --update-key Record_number"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[403\] \[GAIA_NO01\] Using this API token, you cannot run the specified API."

  Scenario: CliKintoneTest-30 Should import the records successfully with username and password
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-30.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD --file-path CliKintoneTest-30.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-31 Should import the records successfully with username (-u option) and password
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-31.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID -u $USERNAME --password $PASSWORD --file-path CliKintoneTest-31.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-32 Should import the records successfully with username and password (-p option)
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-32.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load username and password of the app "app_for_import" with exact permissions "add" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME -p $PASSWORD --file-path CliKintoneTest-32.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-33 Should import the records successfully with --attachments-dir specified and no attachment field.
    Given The csv file "CliKintoneTest-33.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./ --file-path CliKintoneTest-33.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-34 Should return the error message when importing non-existent attachment.
    Given The csv file "CliKintoneTest-34.csv" with content as below:
      | Text   | Number | Attachment         |
      | Alice  | 10     | non_exist_file.txt |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./ --file-path CliKintoneTest-34.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open '(.*)non_exist_file.txt'"

  Scenario: CliKintoneTest-35 Should import the records successfully with attachment.
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And The csv file "CliKintoneTest-35.csv" with content as below:
      | Text   | Number | Attachment |
      | Alice  | 10     | file1.txt  |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./attachments --file-path CliKintoneTest-35.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should has records as below:
      | Text   | Number | Attachment |
      | Alice  | 10     | file1.txt  |
    And The app "app_for_import_attachments" should has attachments as below:
      | RecordIndex   | AttachmentFieldCode | File       | Content |
      | 0             | Attachment          | file1.txt  | 123     |

  Scenario: CliKintoneTest-36 Should return the error message when importing records with a non-existent directory.
    Given The csv file "CliKintoneTest-36.csv" with content as below:
      | Text   | Number | Attachment        |
      | Alice  | 10     | no_exist_file.txt |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN_IMPORT"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN_IMPORT --attachments-dir ./non-exist-dir-c1aceeba-f3e0-45ab-8231-7729d4bc03a0 --file-path CliKintoneTest-36.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory, open '(.*)non-exist-dir-c1aceeba-f3e0-45ab-8231-7729d4bc03a0[\/\\]+no_exist_file.txt'"

  Scenario: CliKintoneTest-37 Should import the records successfully with multiple attachments on a field
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "abc"
    And The csv file "CliKintoneTest-37.csv" with content as below:
      | Text   | Attachment |
      | Alice  | file1.txt\nfile2.txt  |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-37.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should has records as below:
      | Text   | Attachment |
      | Alice  | file1.txt\nfile2.txt  |
    And The app "app_for_import_attachments" should has attachments as below:
      | RecordIndex   | AttachmentFieldCode | File       | Content |
      | 0             | Attachment          | file1.txt  | 123     |
      | 0             | Attachment          | file2.txt  | abc     |

  Scenario: CliKintoneTest-38 Should import the records successfully with multiple attachments on different fields in a record
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "456"
    And I have a file "attachments/file3.txt" with content: "abc"
    And I have a file "attachments/file4.txt" with content: "xyz"
    And The csv file "CliKintoneTest-38.csv" with content as below:
      | Text   | Attachment            | Attachment_0          |
      | Alice  | file1.txt\nfile2.txt  | file3.txt\nfile4.txt  |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-38.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should has records as below:
      | Text   | Attachment            | Attachment_0          |
      | Alice  | file1.txt\nfile2.txt  | file3.txt\nfile4.txt  |
    And The app "app_for_import_attachments" should has attachments as below:
      | RecordIndex   | AttachmentFieldCode | File       | Content |
      | 0             | Attachment          | file1.txt  | 123     |
      | 0             | Attachment          | file2.txt  | 456     |
      | 0             | Attachment_0        | file3.txt  | abc     |
      | 0             | Attachment_0        | file4.txt  | xyz     |

  Scenario: CliKintoneTest-39 Should import the records successfully with multiple attachments on different records
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file1.txt" with content: "123"
    And I have a file "attachments/file2.txt" with content: "456"
    And I have a file "attachments/file3.txt" with content: "abc"
    And I have a file "attachments/file4.txt" with content: "xyz"
    And The csv file "CliKintoneTest-39.csv" with content as below:
      | Text   | Attachment            |
      | Alice  | file1.txt\nfile2.txt  |
      | Lisa   | file3.txt\nfile4.txt  |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-39.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should has records as below:
      | Text   | Attachment            |
      | Alice  | file1.txt\nfile2.txt  |
      | Lisa   | file3.txt\nfile4.txt  |
    And The app "app_for_import_attachments" should has attachments as below:
      | RecordIndex   | AttachmentFieldCode | File       | Content |
      | 0             | Attachment          | file1.txt  | 123     |
      | 0             | Attachment          | file2.txt  | 456     |
      | 1             | Attachment          | file3.txt  | abc     |
      | 1             | Attachment          | file4.txt  | xyz     |

  Scenario: CliKintoneTest-40 Should import the records successfully with .txt attachment.
    Given The app "app_for_import_attachments" has no records
    And I have a file "attachments/file.txt" with content: "G3Gef76wJ5u1mPuh14QhwgeLd5eC0OHU"
    And The csv file "CliKintoneTest-40.csv" with content as below:
      | Text   | Attachment |
      | Alice  | file.txt   |
    And Load app ID of the app "app_for_import_attachments" as env var: "APP_ID"
    And Load app token of the app "app_for_import_attachments" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-40.csv"
    Then I should get the exit code is zero
    And The app "app_for_import_attachments" should has records as below:
      | Text   | Attachment |
      | Alice  | file.txt   |
    And The app "app_for_import_attachments" should has attachments as below:
      | RecordIndex   | AttachmentFieldCode | File       | Content                          |
      | 0             | Attachment          | file.txt   | G3Gef76wJ5u1mPuh14QhwgeLd5eC0OHU |

  Scenario: CliKintoneTest-41 Should return the error message when lacking of --file-path option.
    Given Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: file-path"

  Scenario: CliKintoneTest-42 Should return the error message when importing an unsupported file type.
    Given Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path CliKintoneTest-41.txt"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Unexpected file type: txt is unacceptable."

  Scenario: CliKintoneTest-43 Should return the error message when importing a non-existent CSV file.
    Given Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --attachments-dir ./attachments --file-path 9f56a2be-c8f0-4ecc-8f62-b5b430e34e25.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: ENOENT: no such file or directory"

  Scenario: CliKintoneTest-51 Should import the records successfully with --fields specified.
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-51.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Text --file-path CliKintoneTest-51.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  |        |
      | Bob    |        |
      | Jenny  |        |

  Scenario: CliKintoneTest-52 Should import the records successfully with --fields specified multiple existent field codes.
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-52.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Text,Number --file-path CliKintoneTest-52.csv"
    Then I should get the exit code is zero
    And The app "app_for_import" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-53 Should return the error message when importing records with --fields specified, including existent and non-existent field codes.
    Given The app "app_for_import" has no records
    And The csv file "CliKintoneTest-53.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_for_import" as env var: "APP_ID"
    And Load app token of the app "app_for_import" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --fields Text,Non_Existent_Field_Code --file-path CliKintoneTest-53.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: The specified field \"Non_Existent_Field_Code\" does not exist on the app"

  Scenario: CliKintoneTest-60 Should import the records successfully with the correct guest space id
    Given The app "app_in_guest_space" has no records
    And The csv file "CliKintoneTest-60.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load app token of the app "app_in_guest_space" with exact permissions "add" as env var: "API_TOKEN"
    And Load guest space ID of the app "app_in_guest_space" as env var: "GUEST_SPACE_ID"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --guest-space-id $GUEST_SPACE_ID --file-path CliKintoneTest-60.csv"
    Then I should get the exit code is zero
    And The app "app_in_guest_space" should has records as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |

  Scenario: CliKintoneTest-61 Should return the error message when the guest space does not exist.
    Given The app "app_in_guest_space" has no records
    And The csv file "CliKintoneTest-61.csv" with content as below:
      | Text   | Number |
      | Alice  | 10     |
      | Bob    | 20     |
      | Jenny  | 30     |
    And Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load app token of the app "app_in_guest_space" with exact permissions "add" as env var: "API_TOKEN"
    When I run the command with args "record import --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --api-token $API_TOKEN --guest-space-id 1 --file-path CliKintoneTest-61.csv"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[403\] \[CB_NO02\] No privilege to proceed."
