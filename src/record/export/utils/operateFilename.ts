import path from "path";

export const replaceFilename = (filename: string): string => {
  return filename.replace(/[*?|\\/":<>]/g, "_");
};

export const splitFilepath = (filepath: string): string[] => {
  const filename: string = path.basename(filepath);
  const dir: string = path.dirname(filepath);
  return [filename, dir];
};
