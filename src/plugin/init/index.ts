import { init } from "./src";
import type { TemplateType } from "./src/template";

type Options = {
  name: string;
  template: TemplateType;
};

export const run: (argv: Options) => Promise<void> = async (argv) => {
  init(argv.name, "en", argv.template);
};
