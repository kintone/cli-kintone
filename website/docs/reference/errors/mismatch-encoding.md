# Mismatch encoding

When executing the `import` and `delete` command, an error will be thrown if the specified encoding (default is UTF-8) mismatches the actual encoding of the specified CSV file.

Error message

```shell
ERROR: Failed to decode the specified CSV file.
ERROR: The specified encoding (<<encoding>>) might mismatch the actual encoding of the CSV file.
```

## Implementation

After decoding the header row of the CSV file by the specified encoding (default is UTF-8), the error will be thrown if the decoded string contains untranslatable characters.

Untranslatable characters are `�` and `?` (described in [iconv-lite](https://github.com/ashtuchkin/iconv-lite#other-notes))
