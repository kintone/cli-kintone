---
sidebar_label: Field specifications
sidebar_key: record-import-field-specifications
---

# Field specifications

Basically, the input should be the same as the `value` property of the [API request](https://kintone.dev/en/docs/kintone/overview/field-types/).

## Record information

| Field type       | Input               |
| ---------------- | ------------------- |
| Record number    | Same as API request |
| Record ID        | Not supported       |
| Revision         | Not supported       |
| Created by       | Same as API request |
| Created datetime | Same as API request |
| Updated by       | Same as API request |
| Updated datetime | Same as API request |

## General fields

| Field type           | Input                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Text                 | Same as API request                                                                        |
| Text area            | Same as API request                                                                        |
| Rich text            | Same as API request                                                                        |
| Number               | Same as API request                                                                        |
| Calculated           | Same as API request                                                                        |
| Check box            | Same as API request                                                                        |
| Radio button         | Same as API request                                                                        |
| Multi-choice         | Same as API request                                                                        |
| Drop-down            | Same as API request                                                                        |
| User selection       | [User selection, Department selection, and Group selection](./user-group-org-selection.md) |
| Department selection | [User selection, Department selection, and Group selection](./user-group-org-selection.md) |
| Group selection      | [User selection, Department selection, and Group selection](./user-group-org-selection.md) |
| Date                 | `YYYY-MM-DD`<br/>e.g. `2022-04-01`                                                         |
| Time                 | `HH:MM`<br/>e.g. `09:30`                                                                   |
| Date and time        | - `YYYY-MM-DDTHH:MM:SS±HH:MM`<br/>- `YYYY-MM-DDTHH:MM:SSZ`<br/>e.g. `2022-04-11T07:00Z`    |
| Link                 | Same as API request                                                                        |
| Attachment           | [Attachment](./attachment.md)                                                              |
| Lookup               | Not supported                                                                              |
| Table                | [Table](./table.md)                                                                        |
| Related records      | Not supported                                                                              |
| Category             | Not supported                                                                              |
| Status               | Not supported                                                                              |
| Assignee             | Not supported                                                                              |
| Label                | Not supported                                                                              |
| Blank space          | Not supported                                                                              |
| Border               | Not supported                                                                              |
| Group                | Not supported                                                                              |

## How cli-kintone chooses the field to read from the CSV file

When running the import command

- Without the `--fields` option:
  - All fields in the CSV file that exist on the Kintone app will be imported.
- With the `--fields` option:
  - See the [Specify target fields](../target-fields.md) page.

## How cli-kintone treats missing field/empty string in CSV

- If the field is missing on the header of the CSV file => cli-kintone will ignore that field.
- If the field value in the row is an empty string => cli-kintone will add/update that field with an empty string.
