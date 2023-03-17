import type { CompletionCallback } from "yargs";
import yargs from "yargs";
import { recordCommand } from "./record";
import packageJson from "../../package.json";

const customCompletion = (
  current: string,
  argv: yargs.Argv,
  completionFilter: (onCompleted?: CompletionCallback) => any,
  done: (completions: string[]) => any
) => {
  completionFilter((err, defaultCompletions) => {
    if (!defaultCompletions) {
      done([]);
      return;
    }

    const filteredCompletions: string[] = [];
    const aliasPattern = /^--?[a-zA-Z\d]:$/;
    defaultCompletions.forEach((completion) => {
      // TODO: remove this workaround after https://github.com/yargs/yargs/issues/2268 is fixed.
      if (aliasPattern.test(completion)) {
        return;
      }

      // TODO: remove this workaround after https://github.com/yargs/yargs/issues/2270 is fixed.
      filteredCompletions.push(completion.replace(/(\r\n|\n|\r)/gm, " "));
    });
    done(filteredCompletions);
  });
};

// eslint-disable-next-line no-unused-expressions
yargs
  .command(recordCommand)
  .demandCommand()
  .strict()
  .version(packageJson.version)
  .help()
  .completion("completion", customCompletion as any).argv;
