import runAll from "npm-run-all";
import { globSync } from "glob";
import path from "path";

const featuresPath = path.posix.join(
  "features",
  "**",
  "*.{feature,feature.md}",
);
const featureFiles = globSync(featuresPath, { posix: true });

const patterns = [];
featureFiles.forEach((file) => {
  patterns.push(
    `test:e2e ${file} --format ./cucumber-reporter.js:./allure-results/dummy.txt`,
  );
});

runAll(patterns, {
  parallel: true,
  maxParallel: 10,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr,
  continueOnError: true,
}).catch((error) => {
  if (error.results) {
    error.results
      .filter(({ code }) => code)
      .forEach(({ name }) => {
        console.error(`"pnpm run ${name}" was failed`);
      });
  } else {
    console.error(error);
  }

  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
});
