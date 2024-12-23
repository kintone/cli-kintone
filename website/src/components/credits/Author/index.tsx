import Link from "@docusaurus/Link";
import styles from "./styles.module.scss";

const author = {
  name: "Cybozu, Inc",
  url: "https://cybozu.co.jp/",
  logo: require("./img/cybozu_logo_wide.png").default,
};

export default function Author() {
  return (
    <Link href={author.url} className={styles.author}>
      <img src={author.logo} alt={`${author.logo} logo`} />
      {/* <p>{author.name}</p>*/}
    </Link>
  );
}
