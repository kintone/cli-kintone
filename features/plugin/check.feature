@isolated
@plugin-check
Feature: plugin check

  Scenario: Show error message when running on standalone binary
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin check --input ./src/manifest.json"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "not available in the standalone binary version"

  # The following scenarios require npm version of cli-kintone.
  # They are skipped in E2E tests because E2E tests use standalone binary.

  @skip
  Scenario: Check a plugin with no issues
    Given An asset with key "plugin_project" is available as "src"
    When I run the command with args "plugin check --input ./src/manifest.json"
    Then I should get the exit code is zero
    And The output message should match with the pattern:
      """
      Files checked: 3
      Problems: 0
      """

  @skip
  Scenario: Check a plugin with issues
    Given An asset with key "plugin_with_issues" is available as "src"
    When I run the command with args "plugin check --input ./src/manifest.json"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "cybozu.data"
    And The output message should match with the pattern: "gaia-argoui-"
    And The output message should match with the pattern: "Problems: 3"

  @skip
  Scenario: Check a plugin with JSON format output
    Given An asset with key "plugin_with_issues" is available as "src"
    When I run the command with args "plugin check --input ./src/manifest.json --format json"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "\"errorCount\": 3"

  @skip
  Scenario: Check a plugin zip file
    Given An asset with key "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip" is available as "plugin.zip"
    When I run the command with args "plugin check --input ./plugin.zip"
    Then I should get the exit code is zero
    And The output message should match with the pattern: "Files checked:"

  Scenario: Input file is not specified
    When I run the command with args "plugin check"
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "Missing required argument: input"
