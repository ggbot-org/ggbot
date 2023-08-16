import { importWorkspaceJson } from "./workspacePackage.js"

export const importWorkspaceTsconfigJson = importWorkspaceJson("tsconfig.json")

export const importWorkspaceTsconfigBuildJson = importWorkspaceJson(
	"tsconfig.build.json"
)
