import { join } from "node:path"

import { packageScriptKey } from "./old_packageScriptkey.js"
import { rootPackageDir, rootPackageJson } from "./old_rootPackage.js"

// TODO convert this to TS.

// TODO test that a package do not depend on itself,
// actually a package had this issue.

// TODO check there are no duplicates in dependencies and devDependencies

/** By convention, workspace package name scope is root package name. */
const workspacesNamespace = rootPackageJson.name

export const workspacePackageName = (workspace) =>
	`@${workspacesNamespace}/${workspace}`

export const workspacePackageTasks = [packageScriptKey.checkTypes]

export const importWorkspaceJson = (filename) => async (workspace) => {
	const { default: json } = await import(
		join(rootPackageDir, workspace, filename),
		{
			assert: { type: "json" }
		}
	)
	return json
}

export const importWorkspacePackageJson = importWorkspaceJson("package.json")

export const workspaceExposedScriptKeys = [packageScriptKey.build]