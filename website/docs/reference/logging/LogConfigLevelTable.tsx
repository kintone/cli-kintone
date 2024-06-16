import styles from "./styles.module.scss";

export default function LogConfigLevelTable() {
  return (
    <table className={styles.logConfigTable}>
      <tbody>
        <tr>
          <th>Event level</th>
          <th colSpan={7}>Config level</th>
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
          <td className={styles.included}>included</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
        </tr>
        <tr>
          <td>debug</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
        </tr>
        <tr>
          <td>info</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
        </tr>
        <tr>
          <td>warn</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
        </tr>
        <tr>
          <td>error</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.excluded}>excluded</td>
          <td className={styles.excluded}>excluded</td>
        </tr>
        <tr>
          <td>fatal</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.included}>included</td>
          <td className={styles.excluded}>excluded</td>
        </tr>
      </tbody>
    </table>
  );
}
