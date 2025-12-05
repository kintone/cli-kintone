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
