# Delimiters

When importing records from CSV, line breaks and delimiters are as follows.

| Type                        | Value               |
| --------------------------- | ------------------- |
| Record delimiter            | Auto discovered \*1 |
| Line break inside a content | LF (`\n`)           |
| Field delimiter             | Comma (`,`)         |

\*1: Select the appropriate one from CRLF, LF, and CR automatically.

An error will occur if multiple types of line breaks are used.

We use the function of the csv-parse library for auto discovering.

https://csv.js.org/parse/options/record_delimiter/
