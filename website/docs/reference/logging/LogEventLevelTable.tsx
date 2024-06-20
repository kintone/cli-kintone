import styles from "./styles.module.scss";

export default function LogEventLevelTable() {
  return (
    <table>
      <tbody>
        <tr>
          <th>Level</th>
          <th>Color</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>trace</td>
          <td className={styles.trace}>background green</td>
          <td>
            Detailed information about internal process status.
            <br />
            e.g. internal process status.
          </td>
        </tr>
        <tr>
          <td>debug</td>
          <td className={styles.debug}>green</td>
          <td>
            Diagnostic information that is helpful for troubleshooting or
            testing.
            <br />
            e.g. detailed progress (nth record processing, ),
          </td>
        </tr>
        <tr>
          <td>info</td>
          <td className={styles.info}>blue</td>
          <td>
            Information that is helpful for users in normal usage.
            <br />
            e.g. progress
          </td>
        </tr>
        <tr>
          <td>warn</td>
          <td className={styles.warn}>yellow</td>
          <td>
            The process can continue, but a potential problem happens.
            <br />
            e.g. exported/imported records are empty
          </td>
        </tr>
        <tr>
          <td>error</td>
          <td className={styles.error}>red</td>
          <td>
            The process is aborting due to an error.
            <br />
            e.g. Authentication failure, API limitation, wrong inputs
          </td>
        </tr>
        <tr>
          <td>fatal</td>
          <td className={styles.fatal}>background red</td>
          <td>
            The process is aborting with an unexpected error.
            <br />
            e.g. NPE, OOM, unhandled error from libraries
          </td>
        </tr>
      </tbody>
    </table>
  );
}
