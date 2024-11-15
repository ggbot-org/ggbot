import { exec } from 'node:child_process'
import { exit } from 'node:process'

import { Repository } from './Repository.js'
import { RepositoryPackageJson } from './RepositoryPackageJson.js'
import { WorkspacePackageJson } from './WorkspacePackageJson.js'

export async function buildWorkspacesDependencies (workspacePathname: string) {
	const repository = new Repository()
	await repository.read()

	const { workspaces } = repository

	const internalDependenciesChain = WorkspacePackageJson.internalDependenciesChain(workspacePathname, workspaces)

	const command = RepositoryPackageJson.workspacePrebuildCommandSequence(internalDependenciesChain, workspaces)

	exec(command, { cwd: repository.pathname }, (error) => {
		if (error) {
			console.error(error)
			exit(1)
		}
	})
}
