@isolated
@plugin-init
Feature: plugin init

  Scenario: Fail when the directory already exists
    Given I have a directory "my-plugin"
    When I run the command with a prompt with args "plugin init --name my-plugin"
    And I press Enter for each prompt
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "my-plugin already exists\. Choose a different directory"

  Scenario: Fail without removing the file when a file exists at the path
    Given I have a file "my-plugin" with content: "existing content"
    When I run the command with a prompt with args "plugin init --name my-plugin"
    And I press Enter for each prompt
    Then I should get the exit code is non-zero
    And The output error message should match with the pattern: "my-plugin already exists\. Choose a different directory"
    And The file "my-plugin" should exist
