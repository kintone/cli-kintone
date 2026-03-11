export type { AuthArgv, AuthModule, AuthResolvedArgv } from "./types.js";

import type { AuthArgv, AuthModule } from "./types.js";
import { passwordAuth } from "./passwordAuth.js";
import { apiTokenAuth } from "./apiTokenAuth.js";

export type AuthMethod = "password" | "apiToken";

export const authModules = {
  password: passwordAuth,
  apiToken: apiTokenAuth,
} satisfies Record<AuthMethod, AuthModule>;

export const checkAuth = (
  methods: readonly AuthMethod[],
  argv: AuthArgv,
): true => {
  if (methods.some((m) => authModules[m].check(argv))) {
    return true;
  }
  const description = methods.map((m) => authModules[m].label).join(" or ");
  throw new Error(`Authentication required (${description})`);
};

export const resolveAuthPriority = (
  methods: readonly AuthMethod[],
  argv: AuthArgv,
): void => {
  const matched = methods
    .filter((m) => authModules[m].check(argv))
    .sort((a, b) => authModules[a].priority - authModules[b].priority);

  for (const rest of matched.slice(1)) {
    authModules[rest].clear(argv);
  }
};
