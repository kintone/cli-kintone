@common
Feature: common

  Scenario: 存在しないオプション
    When I run the command with args "record export --app 1 --base-url http://example.com --foo"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown argument: foo"

  Scenario: 存在しないサブコマンド
    When I run the command with args "foo"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Unknown argument: foo"

  Scenario: バージョンを取得する
    When I run the command with args "--version"
    Then I should get the version formatted in "\d+.\d+.\d+"

  Scenario: ヘルプを取得する
    When I run the command with args "--help"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "cli-kintone-(macos|win\.exe|linux) <command>"

  Scenario: ベースURLがない
    When I run the command with args "record export --app 1"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: base-url"

  Scenario: ベースURLに存在しないサブドメインを指定
    When I run the command with args "record export --base-url https://CED2-4782-BB99-1ED18B89E0DA.cybozu.com --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "404: Not Found"

  Scenario: ベースURLのプロトコルがHTTPSでない
    When I run the command with args "record export --base-url http://example.cybozu.com --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Error: The protocol of baseUrl must be \"https\"."

  Scenario: ベースURLのフォーマットが不正
    When I run the command with args "record export --base-url foo --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: TypeError \[ERR_INVALID_URL]: Invalid URL"

  Scenario: アプリ指定のオプションがない
    When I run the command with args "record export --base-url http://example.com"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: app"

  Scenario: アプリ指定がない
    When I run the command with args "record export --base-url http://example.com --app"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Not enough arguments following: app"

  Scenario: アプリに存在しないアプリを指定
    Given Load username and password of user "user_for_common" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[404] \[GAIA_AP01] The app \(ID: 1\) not found. The app may have been deleted."

  Scenario: アプリにゲストスペース内アプリを指定しているがゲストスペースの指定がない
    Given Load app ID of the app "app_in_guest_space" as env var: "APP_ID"
    And Load username and password of user "user_for_guest_space" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Please specify --guest-space-id option to access an App in Guest Spaces."

  Scenario: 認証情報がない
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[401\] \[CB_AU01\] Please login."

  Scenario: APIトークンが不正
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --api-token abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[400\] \[GAIA_IA02\] The specified API token does not match the API token generated via an app."

  Scenario: ユーザー名が間違っている
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username abc --password abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[401\] \[CB_WA01\] Password authentication failed."

  Scenario: パスワードが指定されていない
    Given Load username and password of user "user_for_common" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username $USERNAME"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[401\] \[CB_WA01\] Password authentication failed."

  Scenario: パスワードが間違っている
    Given Load username and password of user "user_for_common" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "record export --base-url $$TEST_KINTONE_BASE_URL --app 1 --username $USERNAME --password abc"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "\[401\] \[CB_WA01\] Password authentication failed."
