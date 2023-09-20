import { join } from "node:path"

import { PackageJson } from "type-fest"

import { repositoryDir } from "./repository.js"
import { RepositoryPackageJson } from "./RepositoryPackageJson.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

export const repositoryPackageJsons = async () => {
	const repositoryPackageJson = new RepositoryPackageJson(repositoryDir)
	await repositoryPackageJson.read()

	const workspaceMap = new Map<
		PackageJson.WorkspacePattern,
		WorkspacePackageJson
	>()

	for (const workspaceDir of repositoryPackageJson.workspaces) {
		const workspacePackageJson = new WorkspacePackageJson(
			join(repositoryDir, workspaceDir)
		)
		await workspacePackageJson.read()
		workspaceMap.set(workspaceDir, workspacePackageJson)
	}

	return { repositoryPackageJson, workspaceMap }
}
