import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Translate, { translate } from "@docusaurus/Translate";

import styles from "./index.module.css";

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline" description="The homepage tagline">
            The CLI tool for importing and exporting Kintone records.
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/guide">
            <Translate
              id="homepage.getStarted"
              description="The get started button label"
            >
              Get Started!
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
};

const Home = (): JSX.Element => {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        id: "homepage.title",
        message:
          "cli-kintone; The CLI tool for importing and exporting Kintone records.",
        description: "The homepage title",
      })}
      description={translate({
        id: "homepage.description",
        message: "The CLI tool for importing and exporting Kintone records.",
        description: "The homepage meta description",
      })}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
};

export default Home;
