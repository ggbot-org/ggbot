import { join } from "node:path"

import readFile from "read-file-utf8"
import { PackageJson } from "type-fest"

import { FileProvider } from "./filesystemProviders.js"
import type { Repository } from "./Repository.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

export class RepositoryPackageJson implements FileProvider {
	directoryPathname: string
	filename = "package.json"

	packageName: PackageJson["name"] = ""
	isPrivate: PackageJson["private"]
	dependencies: PackageJson["dependencies"] = {}
	scripts: NonNullable<PackageJson["scripts"]> = {}
	workspaces: PackageJson.WorkspacePattern[] = []

	constructor(directoryPathname: string) {
		this.directoryPathname = directoryPathname
	}

	static workspaceBuildScriptKey(
		workspacePathname: PackageJson.WorkspacePattern
	) {
		return `build:${workspacePathname}`
	}

	static workspaceBuildCommand(
		workspacePathname: PackageJson.WorkspacePattern
	) {
		return `npm run build -w ${workspacePathname}`
	}

	static workspacePrebuildCommandSequence(
		internalDependenciesChain: string[],
		workspaces: Repository["workspaces"]
	) {
		return internalDependenciesChain
			.map((internalDependency) =>
				WorkspacePackageJson.workspacePathnameFromInternalDependency(
					internalDependency
				)
			)
			.filter((workspacePathname) => {
				const workspace = workspaces.get(workspacePathname)
				if (!workspace) throw Error()
				return workspace.packageJson.buildScriptCommand
			})
			.map((workspacePathname) => `npm run build -w ${workspacePathname}`)
			.join(" && ")
	}

	static workspacePrebuildScriptKey(
		workspacePathname: PackageJson.WorkspacePattern
	) {
		return `prebuild:${workspacePathname}`
	}

	async read() {
		const {
			name,
			dependencies,
			private: isPrivate,
			scripts,
			workspaces
		} = (await readFile(
			join(this.directoryPathname, this.filename)
		)) as PackageJson
		this.packageName = name
		this.dependencies = dependencies
		this.isPrivate = isPrivate
		if (Array.isArray(workspaces)) this.workspaces = workspaces
		if (scripts) this.scripts = scripts
	}

	workspaceBuildScriptCommand(workspaceDir: string) {
		return this.scripts[
			RepositoryPackageJson.workspaceBuildScriptKey(workspaceDir)
		]
	}

	workspacePrebuildScriptCommand(workspaceDir: string) {
		return this.scripts[
			RepositoryPackageJson.workspacePrebuildScriptKey(workspaceDir)
		]
	}
}
