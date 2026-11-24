import clsx from "clsx";
import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import styles from "./styles.module.css";

type FeatureItem = {
  title: JSX.Element;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

// We use https://undraw.co/ illustrations.
const FeatureList: FeatureItem[] = [
  {
    title: (
      <Translate id="homepage.features.easyToUse.title">Easy to Use</Translate>
    ),
    Svg: require("@site/static/img/undraw_well_done_re_3hpo.svg").default,
    description: (
      <Translate id="homepage.features.easyToUse.description">
        The cli-kintone was designed for IT personnel and non-engineers. You
        will get used to it quickly.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.allInOne.title">
        All-in-one Kintone CLI
      </Translate>
    ),
    Svg: require("@site/static/img/undraw_data_at_work.svg").default,
    description: (
      <Translate id="homepage.features.allInOne.description">
        Manage records, develop plugins, and apply JavaScript/CSS customization
        — all from a single tool.
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.automation.title">
        Suitable for automation
      </Translate>
    ),
    Svg: require("@site/static/img/undraw_software_engineer_re_tnjc.svg")
      .default,
    description: (
      <Translate id="homepage.features.automation.description">
        The cli-kintone works well with shell scripts. You can automate your
        routine and regular tasks.
      </Translate>
    ),
  },
];

const Feature = ({ title, Svg, description }: FeatureItem) => {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
};

const HomepageFeatures = (): JSX.Element => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageFeatures;
