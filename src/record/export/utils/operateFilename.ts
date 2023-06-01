// https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[*?|\\/":<>]/g, "_");
};
