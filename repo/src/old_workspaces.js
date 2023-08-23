import { rootPackageJson } from "./old_rootPackage.js"

const isWorkspaceName = (arg) => {
	if (typeof arg !== "string") return false
	return arg !== ""
}

export const workspaceNames = rootPackageJson.workspaces.filter(isWorkspaceName)
