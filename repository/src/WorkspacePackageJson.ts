import { join } from "node:path"

import readFile from "read-file-utf8"
import { PackageJson } from "type-fest"

import { FileProvider } from "./filesystemProviders.js"
import type { Repository } from "./Repository.js"
import type { Workspace } from "./Workspace.js"

export class WorkspacePackageJson implements FileProvider {
	static scope = "@workspace"

	static buildScriptKey = "build"

	directoryPathname: string
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

	constructor(directoryPathname: string) {
		this.directoryPathname = directoryPathname
	}

	static workspacePathnameFromInternalDependency(
		internalDependency: string
	): Workspace["pathname"] {
		const workspacePathname = internalDependency.split("/").pop()
		if (!workspacePathname)
			throw new Error(
				`Cannot get workspace pathname from ${internalDependency}`
			)
		return workspacePathname
	}

	static internalDependenciesChain(
		workspacePathname: Workspace["pathname"],
		workspaces: Repository["workspaces"]
	) {
		const workspace = workspaces.get(workspacePathname)
		if (!workspace) throw Error(`Cannot get workspace ${workspacePathname}`)
		let result = Array.from(workspace.packageJson.internalDependencies)
		for (const internalDependency of result) {
			const dependencyWorkspacePathname =
				WorkspacePackageJson.workspacePathnameFromInternalDependency(
					internalDependency
				)
			const dependencyWorkspace = workspaces.get(
				dependencyWorkspacePathname
			)
			if (!dependencyWorkspace)
				throw Error(`Cannot get workspace ${dependencyWorkspace}`)
			if (dependencyWorkspace.packageJson.internalDependencies.size === 0)
				continue
			result = WorkspacePackageJson.internalDependenciesChain(
				dependencyWorkspacePathname,
				workspaces
			).concat(result)
		}
		return [...new Set(result)]
	}

	async read() {
		const pathname = join(this.directoryPathname, this.filename)
		const packageContent = await readFile<PackageJson>(pathname)
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
