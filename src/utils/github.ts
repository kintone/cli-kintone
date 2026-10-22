/**
 * Common function to call GitHub API
 * Automatically adds authentication header if GITHUB_TOKEN environment variable is set
 */
export const fetchGitHubAPI = async (url: string, options?: RequestInit) => {
  const headers = new Headers(options?.headers);

  // Add authentication header if GITHUB_TOKEN is set
  if (process.env.GITHUB_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
