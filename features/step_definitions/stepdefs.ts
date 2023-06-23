import * as assert from "assert";
import { Given, When, Then } from "@cucumber/cucumber";

const isItFriday = (today: string) => {
  if (today === "Friday") {
    return "TGIF";
  }
  return "Nope";
};

When("I ask whether it's Friday yet", function () {
  this.actualAnswer = isItFriday(this.today);
});

Then("I should be told {string}", function (expectedAnswer) {
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});

Given("today is {string}", function (givenDay) {
  this.today = givenDay;
});
