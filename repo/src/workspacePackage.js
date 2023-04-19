import { join } from "node:path";
import { packageScriptKey } from "./package.js";
import { rootPackageDir } from "./rootPackage.js";
import { workspacesNamespace } from "./workspaces.js";

export const workspacePackageName = (workspace) =>
  `@${workspacesNamespace}/${workspace}`;

export const workspacePackageTasks = [packageScriptKey.checkTypes];

export const importWorkspaceJson = (filename) => async (workspace) => {
  const { default: json } = await import(
    join(rootPackageDir, workspace, filename),
    {
      assert: { type: "json" },
    }
  );
  return json;
};

export const importWorkspacePackageJson = importWorkspaceJson("package.json");
