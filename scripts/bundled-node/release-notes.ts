const START_MARKER = "<!-- bundled-node:start -->";
const END_MARKER = "<!-- bundled-node:end -->";

const countOccurrences = (text: string, search: string): number =>
  text.split(search).length - 1;

const removeBundledNodeSection = (notes: string): string => {
  const startCount = countOccurrences(notes, START_MARKER);
  const endCount = countOccurrences(notes, END_MARKER);
  if (startCount === 0 && endCount === 0) {
    return notes;
  }
  const start = notes.indexOf(START_MARKER);
  const end = notes.indexOf(END_MARKER);
  if (startCount !== 1 || endCount !== 1 || end < start) {
    throw new Error(
      "The release notes contain broken bundled Node.js section markers",
    );
  }
  return notes.slice(0, start) + notes.slice(end + END_MARKER.length);
};

export const upsertBundledNodeSection = (
  notes: string,
  nodeVersion: string,
): string => {
  const section = [
    START_MARKER,
    "### Bundled Node.js",
    "",
    `The executables in this release bundle Node.js v${nodeVersion}.`,
    END_MARKER,
  ].join("\n");
  const rest = removeBundledNodeSection(notes).trimEnd();
  return rest === "" ? `${section}\n` : `${rest}\n\n${section}\n`;
};
