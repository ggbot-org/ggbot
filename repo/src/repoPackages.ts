import { join } from "node:path"

import { PackageJson } from "type-fest"

import { repoDir } from "./repoDir.js"
import { RepoPackageJson } from "./RepoPackageJson.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

export const repoPackages = async () => {
	const repoPackage = new RepoPackageJson(repoDir)
	await repoPackage.read()

	const workspaceMap = new Map<
		PackageJson.WorkspacePattern,
		WorkspacePackageJson
	>()

	for (const workspaceDir of repoPackage.workspaces) {
		const workspacePackageJson = new WorkspacePackageJson(
			join(repoDir, workspaceDir)
		)
		await workspacePackageJson.read()
		workspaceMap.set(workspaceDir, workspacePackageJson)
	}

	return { repoPackage, workspaceMap }
}
