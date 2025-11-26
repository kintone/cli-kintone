@isolated
@plugin-pack
Feature: plugin pack

  Scenario: Pack a plugin
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json --private-key ./src/private.ppk"
    Then I should get the exit code is zero
    And I have a file at "plugin.zip"

  Scenario: Private key is not specified
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: private-key"

  Scenario: Packages a plugin to a custom output path
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json --private-key ./src/private.ppk --output ./dist/plugin.zip"
    Then I should get the exit code is zero
    And I have a file at "./dist/plugin.zip"
