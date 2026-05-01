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

  Scenario: Pack a plugin with sandbox, allowed_hosts and permissions
    Given An asset with key "plugin_project_sandbox" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json --private-key ./src/private.ppk"
    Then I should get the exit code is zero
    And I have a file at "plugin.zip"

  Scenario: Plugin info surfaces sandbox, allowed_hosts and permissions
    Given An asset with key "plugin_project_sandbox" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json --private-key ./src/private.ppk"
    Then I should get the exit code is zero
    And I have a file at "plugin.zip"
    When I run the command with args "plugin info --input ./plugin.zip"
    Then I should get the exit code is zero
    And The output message should match with the pattern:
      """
      sandbox: true
      allowed_hosts: https://example\.com, wss://example\.com/ws/\*
      permissions\.js_api: app:read, network:connect
      permissions\.rest_api: app_record:read
      """

  Scenario: Plugin info --format json surfaces sandbox-related keys with snake_case names
    Given An asset with key "plugin_project_sandbox" is available as "src"
    When I run the command with args "plugin pack --input ./src/manifest.json --private-key ./src/private.ppk"
    Then I should get the exit code is zero
    And I have a file at "plugin.zip"
    When I run the command with args "plugin info --input ./plugin.zip --format json"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "\"sandbox\": true"
    And The output message should match with the pattern: "\"allowed_hosts\": \["
    And The output message should match with the pattern: "\"permissions\":"
    And The output message should match with the pattern: "\"js_api\":"
    And The output message should match with the pattern: "\"rest_api\":"
