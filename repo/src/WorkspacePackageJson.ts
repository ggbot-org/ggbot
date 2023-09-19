import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { PackageJson } from "type-fest"

import { TextFile } from "./TextFile.js"

export class WorkspacePackageJson implements TextFile {
	static scope = "@workspace"

	static buildScriptKey = "build"

	dirPathname: string
	filename = "package.json"

	packageName = ""
	isPrivate = false

	buildScriptCommand: string | undefined

	/** Key = package name value = package version */
	dependencies = new Map<string, string>()

	/** Key = package name value = package version */
	devDependencies = new Map<string, string>()

	/** Can be a dependency or a dev dependency. */
	internalDependencies = new Set<string>()

	constructor(dirPathname: string) {
		this.dirPathname = dirPathname
	}

	static workspaceDirFromInternalDependency(internalDependency: string) {
		const workspaceDir = internalDependency.split("/").pop()
		if (!workspaceDir) throw new Error()
		return workspaceDir
	}

	static internalDependenciesChain(
		workspaceDir: PackageJson.WorkspacePattern,
		workspaceMap: Map<PackageJson.WorkspacePattern, WorkspacePackageJson>
	) {
		const workspace = workspaceMap.get(workspaceDir)
		if (!workspace) throw Error()
		let result = Array.from(workspace.internalDependencies)
		for (const internalDependency of result) {
			const dependencyWorkspaceDir =
				WorkspacePackageJson.workspaceDirFromInternalDependency(
					internalDependency
				)
			const dependencyWorkspace = workspaceMap.get(dependencyWorkspaceDir)
			if (!dependencyWorkspace) throw Error()
			if (dependencyWorkspace.internalDependencies.size === 0) continue
			result = WorkspacePackageJson.internalDependenciesChain(
				dependencyWorkspaceDir,
				workspaceMap
			).concat(result)
		}
		return [...new Set(result)]
	}

	async read() {
		const text = await readFile(
			join(this.dirPathname, this.filename),
			"utf-8"
		)
		const packageContent = JSON.parse(text)
		if (!packageContent || typeof packageContent !== "object")
			throw new TypeError()
		const {
			name = "",
			private: isPrivate,
			dependencies,
			devDependencies,
			scripts
		} = packageContent
		this.packageName = name
		this.isPrivate = Boolean(isPrivate)

		if (dependencies)
			for (const [key, value] of Object.entries(dependencies)) {
				if (typeof value === "string") this.dependencies.set(key, value)
				if (key.startsWith(WorkspacePackageJson.scope))
					this.internalDependencies.add(key)
			}

		if (devDependencies)
			for (const [key, value] of Object.entries(devDependencies)) {
				if (typeof value === "string")
					this.devDependencies.set(key, value)
				if (key.startsWith(WorkspacePackageJson.scope))
					this.internalDependencies.add(key)
			}

		if (scripts && typeof scripts === "object") {
			this.buildScriptCommand =
				scripts[WorkspacePackageJson.buildScriptKey]
		}
	}
}
