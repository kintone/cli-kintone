Feature: cli-kintone record export command

  Scenario: Should return the records with CSV format correctly when using `cli-kintone record export` with api-token authentication
    When I run the command with subcommand "record export" and args "--base-url KINTONE_BASE_URL --app KINTONE_APP_ID --api-token KINTONE_API_TOKEN"
    Then I should get the output including the '"Record_number","Created_by","Created_datetime","Updated_by","Updated_datetime"\n'

