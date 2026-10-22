@isolated
@plugin-upload
Feature: plugin upload

  @serial(plugin_chjjmgadianhfiopehkbjlfkfioglafk)
  Scenario: Upload plugin.zip
    Given The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" is not installed
    And An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin.zip"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "plugin upload --input ./plugin.zip --yes --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is zero
    And The output error message should match with the pattern: "File Path: .*plugin\.zip"
    And The output error message should match with the pattern: "Plugin ID: chjjmgadianhfiopehkbjlfkfioglafk"
    And The output error message should match with the pattern: "Current version: \(not installed\)"
    And The output error message should match with the pattern: "Plugin is installed successfully\."
    And The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" should be installed

  @serial(plugin_chjjmgadianhfiopehkbjlfkfioglafk)
  Scenario: Update plugin
    Given The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" is not installed
    And An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin_v1.zip"
    And An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v2.zip" is available as "plugin_v2.zip"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "plugin upload --input ./plugin_v1.zip --yes --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    And I run the command with args "plugin upload --input ./plugin_v2.zip --yes --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is zero
    And The output error message should match with the pattern: "Current version: 1"
    And The output error message should match with the pattern: "Target version: 2"
    And The output error message should match with the pattern: "Plugin is installed successfully\."
    And The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" and version "2" should be installed

  @serial(plugin_chjjmgadianhfiopehkbjlfkfioglafk)
  Scenario: Continue uploading by pressing "Y"
    Given The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" is not installed
    And An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin.zip"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with a prompt with args "plugin upload --input ./plugin.zip --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    And I type "Y"
    And I press Enter
    Then I should get the exit code is zero
    And The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" should be installed

  @serial(plugin_chjjmgadianhfiopehkbjlfkfioglafk)
  Scenario: Cancel uploading by pressing "N"
    Given The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" is not installed
    And An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin.zip"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with a prompt with args "plugin upload --input ./plugin.zip --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    And I type "N"
    And I press Enter
    Then I should get the exit code is zero
    And The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" should not be installed

  Scenario: Plugin file does not exist
    Given Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "plugin upload --input ./none.zip --yes --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Error: Plugin file not found: .*none\.zip"

  Scenario: Plugin file is not a zip file
    Given I have a file "broken.zip" with content: "not a zip file"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "plugin upload --input ./broken.zip --yes --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Error: End of central directory record signature not found\."

  Scenario: Request to kintone fails
    Given An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin.zip"
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "plugin upload --input ./plugin.zip --yes --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password wrong-password"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: \[401\] \[CB_WA01\] Password authentication failed\."

  Scenario: Missing plugin file is reported before an invalid base URL
    When I run the command with args "plugin upload --input ./none.zip --yes --base-url http://example.com --username user --password pass"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Error: Plugin file not found: .*none\.zip"

  Scenario: Invalid base URL is reported before a broken plugin file
    Given I have a file "broken.zip" with content: "not a zip file"
    When I run the command with args "plugin upload --input ./broken.zip --yes --base-url http://example.com --username user --password pass"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "ERROR: Error: The protocol of baseUrl must be \"https\"\."
