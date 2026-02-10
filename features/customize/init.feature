@isolated
@customize-init
Feature: customize init

  Scenario: Generate template file with default path
    When I run the command with args "customize init --yes"
    Then I should get the exit code is zero
    And The file "customize-manifest.json" should exist
    And The customize-manifest at "customize-manifest.json" should be a valid template

  Scenario: Specify output path
    When I run the command with args "customize init --output test.json --yes"
    Then I should get the exit code is zero
    And The file "test.json" should exist
    And The customize-manifest at "test.json" should be a valid template

  Scenario: Skip confirmation by --yes when file exists
    Given I have a customize-manifest.json file at "customize-manifest.json"
    When I run the command with args "customize init --output customize-manifest.json --yes"
    Then I should get the exit code is zero
    And The customize-manifest at "customize-manifest.json" should be a valid template

  Scenario: Cancel the operation at confirmation
    Given I have a customize-manifest.json file at "customize-manifest.json" with content "EXISTING"
    When I run the command with a prompt with args "customize init"
    And I press Enter
    Then I should get the exit code is zero
    And The customize-manifest at "customize-manifest.json" should have content "EXISTING"
