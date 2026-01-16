export const isUrlString = (str: string): boolean => {
  return /^https?:\/\/.*/i.test(str);
};
