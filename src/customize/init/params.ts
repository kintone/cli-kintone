import { getBoundMessage } from "../core";
import type { Lang } from "../core";
import { promptForAppId, promptForScope } from "./prompts";

export const inquireInitParams = async (lang: Lang) => {
  const m = getBoundMessage(lang);
  const appId = await promptForAppId(m);
  const scope = await promptForScope(m);
  return { appId, scope, lang };
};
