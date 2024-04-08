import runAll from "npm-run-all";
import { globSync } from "glob";

const featureFiles = globSync("features/**/*.{feature,feature.md}");

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
        console.error(`"npm run ${name}" was failed`);
      });
  } else {
    console.error(error);
  }
});
