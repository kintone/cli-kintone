@isolated
@customize-export
Feature: customize export

  @serial(app_for_customize_export)
  Scenario: Export customization settings
    Given The app "app_for_customize_export" has customization from asset "customize_manifest"
    And Load app ID of the app "app_for_customize_export" as env var: "APP_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is zero
    And The file "customize-manifest.json" should exist
    And The customize-manifest at "customize-manifest.json" should be a valid template
    And The customize-manifest at "customize-manifest.json" should have desktop js files
    And The file "desktop/js/sample.js" should exist

  @serial(app_for_customize_export)
  Scenario: Specify output path
    Given The app "app_for_customize_export" has no customization
    And Load app ID of the app "app_for_customize_export" as env var: "APP_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD --output test.json --yes"
    Then I should get the exit code is zero
    And The file "test.json" should exist

  @serial(app_for_customize_export)
  Scenario: Skip confirmation by --yes when file exists
    Given I have an empty file at "customize-manifest.json"
    And Load app ID of the app "app_for_customize_export" as env var: "APP_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is zero
    And The file "customize-manifest.json" should exist
    And The customize-manifest at "customize-manifest.json" should be a valid template

  @serial(app_for_customize_export)
  Scenario: Cancel the operation at confirmation
    Given I have a customize-manifest.json file at "customize-manifest.json" with content "EXISTING"
    And Load app ID of the app "app_for_customize_export" as env var: "APP_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with a prompt with args "customize export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD"
    And I press Enter
    Then I should get the exit code is zero
    And The customize-manifest at "customize-manifest.json" should have content "EXISTING"

  @serial(app_in_guest_space_for_customize_export)
  Scenario: App in a guest space
    Given Load app ID of the app "app_in_guest_space_for_customize_export" as env var: "APP_ID"
    And Load guest space ID of the app "app_in_guest_space_for_customize_export" as env var: "GUEST_SPACE_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD --guest-space-id $GUEST_SPACE_ID --yes"
    Then I should get the exit code is zero
    And The file "customize-manifest.json" should exist

  Scenario: Specified app does not exist
    Given Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize export --base-url $$TEST_KINTONE_BASE_URL --app 999999999 --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "GAIA_AP01|not found|404"
