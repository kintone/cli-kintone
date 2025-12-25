import { CucumberJSAllureFormatter, AllureRuntime } from "allure-cucumberjs";
import type { IFormatterOptions } from "@cucumber/cucumber";
import path from "path";

class Reporter extends CucumberJSAllureFormatter {
  constructor(options: IFormatterOptions) {
    super(
      options,
      new AllureRuntime({
        resultsDir: path.resolve(__dirname, "allure-results"),
      }),
      {},
    );
  }
}

export default Reporter;
