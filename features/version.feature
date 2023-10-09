Feature: cli-kintone version command
  Should return the correct cli-kintone version when using `cli-kintone --version`

  Scenario: Should return the correct cli-kintone version when using `cli-kintone --version`
    When I run the command with args "--version"
    Then I should get the version formatted in "\d.\d.\d(.*)"
