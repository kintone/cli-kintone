import { initPlugin } from "./usecases/init";

type Options = {
  name: string | undefined;
  template: string;
};

export const run: (argv: Options) => Promise<void> = async (argv) => {
  initPlugin({
    name: argv.name,
    lang: "en",
    template: argv.template,
  });
};
