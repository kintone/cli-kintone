---
sidebar_position: 600
---

# Logging

## Overview

cli-kintone supports various logs that help users to check progress, debug, and report issues.

Users can control log output by command line options.

## Command line options

| Option                | Description                                 |
| --------------------- | ------------------------------------------- |
| `--log-level <level>` | Change log config level to specified level. |
| `--verbose`           | Change log config level to `debug`          |

## Log format

```
[(datetime)] (log level): (message)
```

- datetime: The datetime string in ISO8601 format. (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- log level: The log event level. Please see log levels for more details.
- message: The message that describes the event.

On the terminal with color support, the log level is printed with a color.

If a message has line breaks, each line should be shown with a prefix.

```shell
# When the error message has line breaks:
# "The first line\nThe second line\nThe third line"

# The message should be printed as follows
[2023-09-14T19:58:55.938Z] ERROR: The first line
[2023-09-14T19:58:55.938Z] ERROR: The second line
[2023-09-14T19:58:55.938Z] ERROR: The third line
```

## Log printing destination

We print all kinds of logs to **stderr**.

Why: The output of command is printed to stdout, so progress/errors is better to be printed to stderr.

## Log levels

We have two types of log levels: **log event level** and **log config level**.

- Log event level: How we categorize logs.
  - When we send an event message to the logger, each event has a log event level.
- Log config level: How we filter logs to be printed
  - When the logger prints logs, the logger will filter logs using the log config level.

### Log event level

<table>
  <tr>
    <th>Level</th>
    <th>Color</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>trace</td>
    <td class="trace">background green</td>
    <td>Detailed information about internal process status.<br/>e.g. internal process status.</td>
  </tr>
  <tr>
    <td>debug</td>
    <td class="debug">green</td>
    <td>Diagnostic information that is helpful for troubleshooting or testing.<br/>e.g. detailed progress (nth record processing, ),</td>
  </tr>
  <tr>
    <td>info</td>
    <td class="info">blue</td>
    <td>Information that is helpful for users in normal usage.<br/>e.g. progress</td>
  </tr>
  <tr>
    <td>warn</td>
    <td class="warn">yellow</td>
    <td>The process can continue, but a potential problem happens.<br/>e.g. exported/imported records are empty</td>
  </tr>
  <tr>
    <td>error</td>
    <td class="error">red</td>
    <td>The process is aborting due to an error.<br/>e.g. Authentication failure, API limitation, wrong inputs</td>
  </tr>
  <tr>
    <td>fatal</td>
    <td class="fatal">background red</td>
    <td>The process is aborting with an unexpected error.<br/>e.g. NPE, OOM, unhandled error from libraries</td>
  </tr>
</table>

### Log config level

The default log config level is `info`.

<table>
  <tr>
    <th>Event level</th>
    <th colspan="7">Config level</th>
  </tr>
  <tr>
    <th></th>
    <th>trace</th>
    <th>debug</th>
    <th>info</th>
    <th>warn</th>
    <th>error</th>
    <th>fatal</th>
    <th>none</th>
  </tr>
  <tr>
    <td>trace</td>
    <td class="included">included</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
  </tr>
  <tr>
    <td>debug</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
  </tr>
  <tr>
    <td>info</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
  </tr>
  <tr>
    <td>warn</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
  </tr>
  <tr>
    <td>error</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="excluded">excluded</td>
    <td class="excluded">excluded</td>
  </tr>
  <tr>
    <td>fatal</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="included">included</td>
    <td class="excluded">excluded</td>
  </tr>
</table>
