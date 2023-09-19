import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { PackageJson } from "type-fest"

import { TextFile } from "./TextFile.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

export class RepoPackageJson implements TextFile {
	dirPathname: string
	filename = "package.json"

	packageName: PackageJson["name"] = ""
	isPrivate: PackageJson["private"]
	dependencies: PackageJson["dependencies"] = {}
	scripts: NonNullable<PackageJson["scripts"]> = {}
	workspaces: PackageJson.WorkspacePattern[] = []

	constructor(dirPathname: string) {
		this.dirPathname = dirPathname
	}

	static workspaceBuildScriptKey(workspaceDir: PackageJson.WorkspacePattern) {
		return `build:${workspaceDir}`
	}

	static workspaceBuildCommand(workspaceDir: PackageJson.WorkspacePattern) {
		return `npm run build -w ${workspaceDir}`
	}

	static workspacePrebuildCommandSequence(
		internalDependenciesChain: string[],
		workspaceMap: Map<PackageJson.WorkspacePattern, WorkspacePackageJson>
	) {
		return internalDependenciesChain
			.map((internalDependency) =>
				WorkspacePackageJson.workspaceDirFromInternalDependency(
					internalDependency
				)
			)
			.filter((workspaceDir) => {
				const workspace = workspaceMap.get(workspaceDir)
				if (!workspace) throw Error()
				return workspace.buildScriptCommand
			})
			.map((workspaceDir) => `npm run build -w ${workspaceDir}`)
			.join(" && ")
	}

	static workspacePrebuildScriptKey(
		workspaceDir: PackageJson.WorkspacePattern
	) {
		return `prebuild:${workspaceDir}`
	}

	async read() {
		const text = await readFile(
			join(this.dirPathname, this.filename),
			"utf-8"
		)
		const {
			name,
			dependencies,
			private: isPrivate,
			scripts,
			workspaces
		} = JSON.parse(text) as PackageJson
		this.packageName = name
		this.dependencies = dependencies
		this.isPrivate = isPrivate
		if (Array.isArray(workspaces)) this.workspaces = workspaces
		if (scripts) this.scripts = scripts
	}

	workspaceBuildScriptCommand(workspaceDir: string) {
		return this.scripts[
			RepoPackageJson.workspaceBuildScriptKey(workspaceDir)
		]
	}

	workspacePrebuildScriptCommand(workspaceDir: string) {
		return this.scripts[
			RepoPackageJson.workspacePrebuildScriptKey(workspaceDir)
		]
	}
}
