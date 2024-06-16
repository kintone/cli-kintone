import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { useColorMode } from "@docusaurus/theme-common";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  SvgDark?: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

// We use https://undraw.co/ illustrations.
const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    // eslint-disable-next-line node/no-missing-require
    Svg: require("@site/static/img/undraw_well_done_re_3hpo_light.svg").default,
    SvgDark: require("@site/static/img/undraw_well_done_re_3hpo.svg").default,
    description: (
      <>
        The cli-kintone was designed for IT personnel and non-engineers. You
        will get used to it quickly.
      </>
    ),
  },
  {
    title: "Attachment field support",
    Svg: require("@site/static/img/undraw_add_files_re_v09g_light.svg").default,
    SvgDark: require("@site/static/img/undraw_add_files_re_v09g.svg").default,
    description: (
      <>
        The cli-kintone supports Attachment fields. You can download or upload
        files among with Kintone records.
      </>
    ),
  },
  {
    title: "Suitable for automation",
    Svg: require("@site/static/img/undraw_software_engineer_re_tnjc_light.svg")
      .default,
    SvgDark: require("@site/static/img/undraw_software_engineer_re_tnjc.svg")
      .default,
    description: (
      <>
        The cli-kintone works well with shell scripts. You can automate your
        routine and regular tasks.
      </>
    ),
  },
];

const Feature = ({ title, Svg, SvgDark, description }: FeatureItem) => {
  const { colorMode } = useColorMode();

  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        {SvgDark && colorMode === "dark" ? (
          <SvgDark className={styles.featureSvg} role="img" />
        ) : (
          <Svg className={styles.featureSvg} role="img" />
        )}
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
