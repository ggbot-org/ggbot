import { workspacesNamespace } from "./workspaces.js";

export const workspacePackageName = (workspace) =>
  `@${workspacesNamespace}/${workspace}`;

export const tsconfigPackageName = workspacePackageName("tsconfig");
export const eslintConfigPackageName = workspacePackageName("eslint-config");
