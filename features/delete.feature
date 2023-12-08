@isolated
Feature: cli-kintone delete command

  Scenario: CliKintoneTest-128 Should delete records when specific an API Token and also include username/password
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

  Scenario: CliKintoneTest-129 Should delete all records of a specified Kintone app
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

  Scenario: CliKintoneTest-132 Should delete records of specified app successfully with two valid API Token in different apps.
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
