import { initPlugin } from "./usecases/init";

type Options = {
  name: string | undefined;
  template: string;
};

export const run: (argv: Options) => Promise<void> = async (argv) => {
  initPlugin(argv.name, "en", argv.template);
};
