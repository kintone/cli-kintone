@isolated
@keygen
Feature: plugin keygen

  Scenario: Private key generation
    When I run the command with args "plugin keygen --output private.ppk"
    Then I should get the exit code is zero
    And I have a file at "private.ppk"
