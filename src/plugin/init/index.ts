import { initPlugin } from "./usecases/init";
import type { TemplateType } from "./utils/template";

type Options = {
  name: string;
  template: TemplateType;
};

export const run: (argv: Options) => Promise<void> = async (argv) => {
  initPlugin(argv.name, "en", argv.template);
};
