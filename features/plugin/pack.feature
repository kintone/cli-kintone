@isolated
@plugin-pack
Feature: plugin pack

  Scenario: Packaging a plugin successfully
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json --private-key ./src/private.ppk"
    Then I should get the exit code is zero
    And I have a file at "plugin.zip"

  Scenario: Missing private key
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: private-key"

  Scenario: Specify output option
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json --private-key ./src/private.ppk --output ./dist/plugin.zip"
    Then I should get the exit code is zero
    And I have a file at "./dist/plugin.zip"
