@isolated
@plugin-info
Feature: plugin info

  Scenario: Show plugin info in plain text
    Given An asset "plugin.zip" exists
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

  Scenario: Show plugin info in json
    Given An asset "plugin.zip" exists
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
