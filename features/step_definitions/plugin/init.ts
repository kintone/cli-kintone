import { stripVTControlCharacters } from "util";
import { When } from "../../utils/world";

// A prompt redraws its line after moving the cursor to the first column, so only the text after the last move remains on the screen.
const toScreenLine = (line: string): string =>
  stripVTControlCharacters(line.slice(Math.max(line.lastIndexOf("\x1b[G"), 0)));

// A prompt ignores the input sent before it is shown, so press Enter once each time a new prompt is shown.
When("I press Enter for each prompt", function () {
  return new Promise<void>((resolve) => {
    let stdout = "";
    let answeredCount = 0;
    this.childProcess.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
      // A prompt ends its line when it is answered.
      const finishedLineCount = stdout.split("\n").length - 1;
      const currentLine = stdout.slice(stdout.lastIndexOf("\n") + 1);
      if (
        answeredCount === finishedLineCount &&
        toScreenLine(currentLine).startsWith("?")
      ) {
        answeredCount++;
        this.childProcess.stdin.write("\n");
      }
    });
    this.childProcess.on("close", () => {
      resolve();
    });
  });
});
