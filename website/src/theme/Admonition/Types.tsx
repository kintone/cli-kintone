import DefaultAdmonitionTypes from "@theme-original/Admonition/Types";
import ExperimentalAdmonition from "./ExperimentalAdmonition";
import DeprecatedAdmonition from "./DeprecatedAdmonition";

// https://docusaurus.io/docs/markdown-features/admonitions
const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,

  // For stability index
  experimental: ExperimentalAdmonition,
  deprecated: DeprecatedAdmonition,
};

export default AdmonitionTypes;
