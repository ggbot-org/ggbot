import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { DirectoryProvider } from "./filesystemProviders.js"
import { RepositoryPackageJson } from "./RepositoryPackageJson.js"
import { Workspace } from "./Workspace.js"

export class Repository implements DirectoryProvider {
	pathname: string
	packageJson: RepositoryPackageJson
	workspaces: Map<Workspace["pathname"], Workspace>

	constructor() {
		this.pathname = resolve(
			dirname(dirname(dirname(fileURLToPath(import.meta.url))))
		)

		this.packageJson = new RepositoryPackageJson(this.pathname)
		this.workspaces = new Map()
	}

	async read() {
		await this.packageJson.read()
		for (const workspacePathname of this.packageJson.workspaces) {
			const workspace = new Workspace(
				join(this.pathname, workspacePathname)
			)
			await workspace.read()
			this.workspaces.set(workspacePathname, workspace)
		}
	}
}
