// eslint-disable-next-line node/no-unpublished-import
import { Octokit } from "@octokit/rest";
import * as fs from "fs/promises";

const ignoredAccounts = [
  "renovate[bot]",
  "github-actions[bot]",
  "trigger-github-actions-release[bot]",
  "renovate-bot",
];

(async () => {
  const octokit = new Octokit();

  const resp = await octokit.paginate(
    "GET /repos/{owner}/{repo}/contributors",
    { owner: "kintone", repo: "cli-kintone" },
  );

  const contributors = resp
    .filter(
      (c) => c.type === "User" && !ignoredAccounts.includes(c.login ?? ""),
    )
    .map((c) => ({ login: c.login, avatar_url: c.avatar_url }));

  const json = JSON.stringify(contributors, null, 2);
  await fs.writeFile("contributors.json", json);
})();
