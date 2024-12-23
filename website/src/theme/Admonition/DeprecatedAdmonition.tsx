import Admonition from "@theme-original/Admonition";
import Link from "@docusaurus/Link";

export default function DeprecatedAdmonition(props) {
  const title = (
    <span>
      <Link href="/community/stability-index#deprecated">Deprecated</Link>
      {props.title ? `: ${props.title}` : null}
    </span>
  );
  return (
    <Admonition type="danger" title={title}>
      {props.children}
    </Admonition>
  );
}
