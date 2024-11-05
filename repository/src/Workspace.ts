import { DirectoryProvider } from "./filesystemProviders.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

export class Workspace implements DirectoryProvider {
	pathname: string
	packageJson: WorkspacePackageJson

	constructor(pathname: string) {
		this.pathname = pathname
		this.packageJson = new WorkspacePackageJson(pathname)
	}

	async read() {
		await this.packageJson.read()
	}
}
