import { setWorldConstructor } from "@cucumber/cucumber";
import { Given, OurWorld } from "../ultils/world";
import {
  execCliKintoneSync,
  replaceTokenWithEnvVars,
  createCsvFile,
} from "../ultils/helper";

setWorldConstructor(OurWorld);

Given(
  "The app {string} has some records as below:",
  async function (appId, table) {
    const tempFilePath = await createCsvFile(table.raw());
    const command = `record import --file-path ${tempFilePath} --app ${appId} --base-url $$TEST_KINTONE_BASE_URL --username $$TEST_KINTONE_USERNAME --password $$TEST_KINTONE_PASSWORD`;

    const response = execCliKintoneSync(replaceTokenWithEnvVars(command));
    if (response.status !== 0) {
      throw new Error(`Importing CSV failed. Error: \n${response.stderr}`);
    }
  },
);
