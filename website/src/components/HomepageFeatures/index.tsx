import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
// https://github.com/facebook/docusaurus/issues/7986#issuecomment-1969481536
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/core/lib/client/exports/useBaseUrl";

type FeatureItem = {
  title: string;
  svg: {
    light: string;
    dark: string;
  };
  description: JSX.Element;
};

// We use https://undraw.co/ illustrations.
const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    // eslint-disable-next-line node/no-missing-require
    svg: {
      light: "/img/undraw_well_done_re_3hpo_light.svg",
      dark: "/img/undraw_well_done_re_3hpo.svg",
    },
    description: (
      <>
        The cli-kintone was designed for IT personnel and non-engineers. You
        will get used to it quickly.
      </>
    ),
  },
  {
    title: "Attachment field support",
    svg: {
      light: "/img/undraw_add_files_re_v09g_light.svg",
      dark: "/img/undraw_add_files_re_v09g.svg",
    },
    description: (
      <>
        The cli-kintone supports Attachment fields. You can download or upload
        files among with Kintone records.
      </>
    ),
  },
  {
    title: "Suitable for automation",
    svg: {
      light: "/img/undraw_software_engineer_re_tnjc_light.svg",
      dark: "/img/undraw_software_engineer_re_tnjc.svg",
    },
    description: (
      <>
        The cli-kintone works well with shell scripts. You can automate your
        routine and regular tasks.
      </>
    ),
  },
];

const Feature = ({ title, svg, description }: FeatureItem) => {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <ThemedImage
          className={styles.featureSvg}
          role="img"
          sources={{
            light: useBaseUrl(svg.light),
            dark: useBaseUrl(svg.dark),
          }}
        />
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
