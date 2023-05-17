import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import pkg from "../../package.json" assert { type: "json" };

export const rootPackageJson = pkg;

export const rootPackageDir = dirname(
  dirname(dirname(fileURLToPath(import.meta.url)))
);

export const rootPackageJsonWorkspaceScriptKey = (scriptKey, workspace) =>
  `${scriptKey}:${workspace}`;
