import { join } from "node:path"

import readFile from "read-file-utf8"
import { PackageJson } from "type-fest"

import { FileProvider } from "./filesystemProviders.js"
import type { Repository } from "./Repository.js"
import { Workspace } from "./Workspace.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

export class RepositoryPackageJson implements FileProvider {
	static buildScriptKey = "build"

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

	static buildCommandSequence(workspaces: Repository["workspaces"]) {
		const workspacePathnames = Array.from(workspaces.keys())
		const seenDependency = new Set()

		const workspacePathnamesSortedByDependencies = workspacePathnames
			.reduce<Array<Workspace["pathname"]>>((list, workspacePathname) => {
				const dependencies =
					WorkspacePackageJson.internalDependenciesChain(
						workspacePathname,
						workspaces
					).map(
						WorkspacePackageJson.workspacePathnameFromInternalDependency
					)
				for (const dependency of dependencies)
					seenDependency.add(dependency)

				// If workspace is a dependency of some other workspace in the list, add it before other list elements.
				if (seenDependency.has(workspacePathname))
					return [...dependencies, workspacePathname, ...list]
				// Otherwise append it to the list.
				return [...list, ...dependencies, workspacePathname]
			}, [])
			.filter(RepositoryPackageJson.onlyWorkspacesWithBuild(workspaces))

		return [...new Set(workspacePathnamesSortedByDependencies)]
			.map((workspacePathname) =>
				RepositoryPackageJson.workspaceBuildCommand(workspacePathname)
			)
			.join(" && ")
	}

	static onlyWorkspacesWithBuild(workspaces: Repository["workspaces"]) {
		return (workspacePathname: string) => {
			const workspace = workspaces.get(workspacePathname)
			if (!workspace) throw Error()
			return workspace.packageJson.buildScriptCommand
		}
	}

	static workspaceBuildScriptKey(
		workspacePathname: PackageJson.WorkspacePattern
	) {
		return `${RepositoryPackageJson.buildScriptKey}:${workspacePathname}`
	}

	static workspaceBuildCommand(
		workspacePathname: PackageJson.WorkspacePattern
	) {
		return `npm run ${WorkspacePackageJson.buildScriptKey} -w ${workspacePathname}`
	}

	static workspacePrebuildCommand(
		workspacePathname: PackageJson.WorkspacePattern
	) {
		return `npm run build_workspace_dependencies -w repository ${workspacePathname}`
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
			.filter(RepositoryPackageJson.onlyWorkspacesWithBuild(workspaces))
			.map((workspacePathname) =>
				RepositoryPackageJson.workspaceBuildCommand(workspacePathname)
			)
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
		} = await readFile<PackageJson>(
			join(this.directoryPathname, this.filename)
		)
		this.packageName = name
		this.dependencies = dependencies
		this.isPrivate = isPrivate
		if (Array.isArray(workspaces)) this.workspaces = workspaces
		if (scripts) this.scripts = scripts
	}

	buildScriptCommand() {
		return this.scripts[RepositoryPackageJson.buildScriptKey]
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
