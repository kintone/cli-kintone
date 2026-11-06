import { upsertBundledNodeSection } from "./release-notes";

const section = (nodeVersion: string) =>
  [
    "<!-- bundled-node:start -->",
    "### Bundled Node.js",
    "",
    `The executables in this release bundle Node.js v${nodeVersion}.`,
    "<!-- bundled-node:end -->",
  ].join("\n");

const notes = [
  "## [1.23.0](https://github.com/kintone/cli-kintone/compare/v1.22.4...v1.23.0) (2026-11-10)",
  "",
  "### Bug Fixes",
  "",
  "* fix something",
].join("\n");

describe("upsertBundledNodeSection", () => {
  it("should append the section to the notes", () => {
    expect(upsertBundledNodeSection(`${notes}\n`, "26.13.0")).toBe(
      `${notes}\n\n${section("26.13.0")}\n`,
    );
  });

  it("should return the same notes when applied twice", () => {
    const once = upsertBundledNodeSection(notes, "26.13.0");
    expect(upsertBundledNodeSection(once, "26.13.0")).toBe(once);
  });

  it("should replace the section of another version", () => {
    const old = upsertBundledNodeSection(notes, "26.12.1");
    expect(upsertBundledNodeSection(old, "26.13.0")).toBe(
      `${notes}\n\n${section("26.13.0")}\n`,
    );
  });

  it("should create the notes with only the section when the notes are empty", () => {
    expect(upsertBundledNodeSection("", "26.13.0")).toBe(
      `${section("26.13.0")}\n`,
    );
  });

  it("should keep other sections and HTML comments", () => {
    const notesWithComment = `${notes}\n\n<!-- other comment -->\n\n### Other Section\n`;
    expect(upsertBundledNodeSection(notesWithComment, "26.13.0")).toBe(
      `${notes}\n\n<!-- other comment -->\n\n### Other Section\n\n${section("26.13.0")}\n`,
    );
  });

  it.each([
    ["only the start marker", `${notes}\n<!-- bundled-node:start -->`],
    ["only the end marker", `${notes}\n<!-- bundled-node:end -->`],
    [
      "the markers in reverse order",
      `${notes}\n<!-- bundled-node:end -->\n<!-- bundled-node:start -->`,
    ],
    [
      "two sections",
      `${notes}\n\n${section("26.12.1")}\n\n${section("26.13.0")}`,
    ],
  ])("should reject the notes with %s", (_description, brokenNotes) => {
    expect(() => upsertBundledNodeSection(brokenNotes, "26.13.0")).toThrow(
      "The release notes contain broken bundled Node.js section markers",
    );
  });
});
