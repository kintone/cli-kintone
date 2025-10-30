@isolated
@plugin-info
Feature: plugin info

  Scenario: Display plugin info in plain text format
    Given An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin.zip"
    When I run the command with args "plugin info --input ./plugin.zip"
    Then I should get the exit code is zero
    And The output message should match with the pattern:
      """
      id: chjjmgadianhfiopehkbjlfkfioglafk
      name: hello-kintone
      version: 1
      description: Description of hello-kintone in English.
      homepage: https://example.com/en/
      """

  Scenario: Display plugin info in JSON format
    Given An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin.zip"
    When I run the command with args "plugin info --input ./plugin.zip --format json"
    Then I should get the exit code is zero
    And The output message should match with the pattern:
      """json
      {
        "id": "chjjmgadianhfiopehkbjlfkfioglafk",
        "name": "hello-kintone",
        "version": 1,
        "description": "Description of hello-kintone in English.",
        "homepage": "https://example.com/en/"
      }
      """
