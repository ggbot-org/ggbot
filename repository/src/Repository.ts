import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { DirectoryProvider } from './filesystemProviders.js'
import { RepositoryPackageJson } from './RepositoryPackageJson.js'
import { RepositoryTsconfigJson } from './RepositoryTsconfigJson.js'
import { Workspace } from './Workspace.js'

export class Repository implements DirectoryProvider {
	pathname = resolve(dirname(dirname(dirname(fileURLToPath(import.meta.url)))))
	packageJson: RepositoryPackageJson
	tsconfigJson: RepositoryTsconfigJson
	workspaces = new Map<Workspace['pathname'], Workspace>()

	constructor() {
		this.packageJson = new RepositoryPackageJson(this.pathname)
		this.tsconfigJson = new RepositoryTsconfigJson(this.pathname)
	}

	async read() {
		await this.packageJson.read()
		await this.tsconfigJson.read()
		for (const workspacePathname of this.packageJson.workspaces) {
			const workspace = new Workspace(
				join(this.pathname, workspacePathname)
			)
			await workspace.read()
			this.workspaces.set(workspacePathname, workspace)
		}
	}
}
