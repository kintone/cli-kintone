import React from "react";
import Link from "@docusaurus/Link";
import contributors from "../../../../contributors.json";
import styles from "./styles.module.scss";

export default function ContributorsList() {
  return (
    <ul className={styles.contributors}>
      {contributors.map((contributor) => (
        <li key={contributor.login}>
          <Link
            href={`https://github.com/kintone/cli-kintone/commits?author=${contributor.login}`}
          >
            <img
              src={contributor.avatar_url}
              alt={`${contributor.login} avatar`}
            />
            <span>{contributor.login}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
