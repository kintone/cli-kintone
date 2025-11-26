@isolated
@plugin-keygen
Feature: plugin keygen

  Scenario: Generates a private key file
    When I run the command with args "plugin keygen --output private.ppk"
    Then I should get the exit code is zero
    And I have a file at "private.ppk"
