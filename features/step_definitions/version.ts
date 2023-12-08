import * as assert from "assert";
import { Then } from "../utils/world";

Then(
  "I should get the version formatted in {string}",
  function (versionFormat: string) {
    const reg = new RegExp(versionFormat);
    assert.match(this.response.stdout.toString(), reg);
  },
);
