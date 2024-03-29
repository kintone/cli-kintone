import type { AllureJestApi } from "allure-jest/dist/AllureJestApi";

declare global {
  const allure: AllureJestApi;
}

beforeEach(() => {
  allure.epic("Unit tests");
});
