import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { PackageJson } from "type-fest"

import { JsonFile } from "./JsonFile.js"

export class RepoPackageJson implements JsonFile {
	dirPathname: string
	filename = "package.json"

	packageName: PackageJson["name"] = ""
	isPrivate: PackageJson["private"]
	dependencies: PackageJson["dependencies"] = {}
	scripts: NonNullable<PackageJson["scripts"]> = {}
	workspaces: PackageJson.WorkspacePattern[] = []

	static workspaceBuildScriptKey(workspace: string) {
		return `build:${workspace}`
	}
	static workspaceBuildCommand(workspace: string) {
		return `npm run build -w ${workspace}`
	}

	static workspaceBuildCommandSequence(workspaces: string[]) {
		return workspaces
			.map((workspace) =>
				RepoPackageJson.workspaceBuildCommand(workspace)
			)
			.join(" && ")
	}

	constructor(dirPathname: string) {
		this.dirPathname = dirPathname
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

	workspaceBuildScriptCommand(workspace: string) {
		return this.scripts[RepoPackageJson.workspaceBuildScriptKey(workspace)]
	}
}
