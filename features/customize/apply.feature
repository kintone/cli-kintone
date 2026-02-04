@isolated
@customize-apply
Feature: customize apply

  @serial(app_for_customize_apply)
  Scenario: Apply customization from manifest file
    Given An asset with key "customize_manifest" is available as "manifest"
    And The app "app_for_customize_apply" has no customization
    And Load app ID of the app "app_for_customize_apply" as env var: "APP_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize apply --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --input manifest/customize-manifest.json --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is zero
    # Verify customization was applied by exporting it
    When I run the command with args "customize export --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --username $USERNAME --password $PASSWORD --output exported.json --yes"
    Then I should get the exit code is zero
    And The file "exported.json" should exist
    And The customize-manifest at "exported.json" should be a valid template
    And The customize-manifest at "exported.json" should have desktop js files
    And The file "desktop/js/sample.js" should exist

  @serial(app_for_customize_apply)
  Scenario: Skip confirmation by --yes
    Given An asset with key "customize_manifest" is available as "manifest"
    And Load app ID of the app "app_for_customize_apply" as env var: "APP_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize apply --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --input manifest/customize-manifest.json --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is zero

  @serial(app_for_customize_apply)
  Scenario: Cancel the operation at confirmation
    Given An asset with key "customize_manifest" is available as "manifest"
    And The app "app_for_customize_apply" has no customization
    And Load app ID of the app "app_for_customize_apply" as env var: "APP_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with a prompt with args "customize apply --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --input manifest/customize-manifest.json --username $USERNAME --password $PASSWORD"
    And I press Enter
    Then I should get the exit code is zero

  @serial(app_in_guest_space_for_customize_apply)
  Scenario: App in a guest space
    Given An asset with key "customize_manifest" is available as "manifest"
    And Load app ID of the app "app_in_guest_space_for_customize_apply" as env var: "APP_ID"
    And Load guest space ID of the app "app_in_guest_space_for_customize_apply" as env var: "GUEST_SPACE_ID"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize apply --base-url $$TEST_KINTONE_BASE_URL --app $APP_ID --input manifest/customize-manifest.json --username $USERNAME --password $PASSWORD --guest-space-id $GUEST_SPACE_ID --yes"
    Then I should get the exit code is zero

  Scenario: Specified app does not exist
    Given An asset with key "customize_manifest" is available as "manifest"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "customize apply --base-url $$TEST_KINTONE_BASE_URL --app 999999999 --input manifest/customize-manifest.json --username $USERNAME --password $PASSWORD --yes"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "GAIA_AP01|not found|404"
