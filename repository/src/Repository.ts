import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { DirectoryProvider } from "./filesystemProviders.js"
import { RepositoryTsconfigJson } from "./RepositoryTsconfigJson.js"
import { RepositoryPackageJson } from "./RepositoryPackageJson.js"
import { Workspace } from "./Workspace.js"

export class Repository implements DirectoryProvider {
	static pathname: Repository["pathname"] = resolve(
		dirname(dirname(dirname(fileURLToPath(import.meta.url))))
	)

	pathname: string
	packageJson: RepositoryPackageJson
	tsconfigJson: RepositoryTsconfigJson
	readonly workspaces = new Map<Workspace["pathname"], Workspace>()

	constructor() {
		this.pathname = Repository.pathname
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
