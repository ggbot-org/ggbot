import {
  importWorkspaceJson,
  workspacePackageName,
} from "./workspacePackage.js";

export const tsconfigPackageName = workspacePackageName("tsconfig");

export const importWorkspaceTsconfigJson = importWorkspaceJson("tsconfig.json");

export const importWorkspaceTsconfigBuildJson = importWorkspaceJson(
  "tsconfig.build.json"
);
