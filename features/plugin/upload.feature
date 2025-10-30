@isolated
@plugin-upload
Feature: plugin upload

  Scenario: Uploading plugin.zip
    Given The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" is not installed
    And An asset "plugin.zip" exists
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with args "plugin upload --input ./plugin.zip --yes --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    Then I should get the exit code is zero
    And The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" should be installed

  Scenario: Continue uploading by pressing "Y"
    Given The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" is not installed
    And An asset "plugin.zip" exists
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with a prompt with args "plugin upload --input ./plugin.zip --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    And I type "Y"
    And I press Enter
    Then I should get the exit code is zero
    And The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" should be installed

  Scenario: Cancel uploading by pressing "Y"
    Given The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" is not installed
    And An asset "plugin.zip" exists
    And Load username and password of user "kintone_admin" as env vars: "USERNAME" and "PASSWORD"
    When I run the command with a prompt with args "plugin upload --input ./plugin.zip --base-url $$TEST_KINTONE_BASE_URL --username $USERNAME --password $PASSWORD"
    And I type "N"
    And I press Enter
    Then I should get the exit code is zero
    And The plugin with id "chjjmgadianhfiopehkbjlfkfioglafk" should not be installed
