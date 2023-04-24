import { join } from "node:path";
import { packageScriptKey } from "./package.js";
import { rootPackageDir, rootPackageJson } from "./rootPackage.js";

/**
 * By convention, workspace package name scope is root package name.
 */
const workspacesNamespace = rootPackageJson.name;

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

export const workspaceExposedScriptKeys = [
  packageScriptKey.build,
  packageScriptKey.test,
];
