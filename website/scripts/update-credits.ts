import { Octokit } from "@octokit/rest";
import * as fs from "fs/promises";

const ignoredUsers = [
  "renovate[bot]",
  "github-actions[bot]",
  "trigger-github-actions-release[bot]",
  "renovate-bot",
  "claude",
];

(async () => {
  const octokit = new Octokit();

  // We use stats because the response of octokit.repos.listContributors is missing some contributors.
  const resp = await octokit.repos.getContributorsStats({
    owner: "kintone",
    repo: "cli-kintone",
  });

  const contributors = resp.data
    .filter(
      (c) =>
        c.author?.type === "User" && !ignoredUsers.includes(c.author.login),
    )
    .sort((c1, c2) => c2.total - c1.total)
    .map((c) => ({
      login: c.author?.login,
      avatar_url: c.author?.avatar_url,
    }));

  const json = JSON.stringify(contributors, null, 2);
  await fs.writeFile("contributors.json", json + "\n");
})();
