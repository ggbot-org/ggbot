import { DirectoryProvider } from "./filesystemProviders.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

export class Workspace implements DirectoryProvider {
	pathname: string
	packageJson: WorkspacePackageJson

	constructor(pathname: Workspace["pathname"]) {
		this.pathname = pathname
		this.packageJson = new WorkspacePackageJson(this.pathname)
	}

	async read() {
		await this.packageJson.read()
	}
}
