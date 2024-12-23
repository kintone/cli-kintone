import Admonition from "@theme-original/Admonition";
import Link from "@docusaurus/Link";

export default function ExperimentalAdmonition(props) {
  const title = (
    <span>
      <Link href="/community/stability-index#experimental">Experimental</Link>
      {props.title ? `: ${props.title}` : null}
    </span>
  );
  return (
    <Admonition type="warning" title={title}>
      {props.children}
    </Admonition>
  );
}
