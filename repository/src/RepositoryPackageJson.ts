import { join } from 'node:path'

import readFile from 'read-file-utf8'

import { FileProvider } from './filesystemProviders.js'
import { PackageJson } from './PackageJson.js'
import { Repository } from './Repository.js'
import { WorkspacePackageJson } from './WorkspacePackageJson.js'

export class RepositoryPackageJson implements FileProvider {
	static buildScriptKey = 'build'

	directoryPathname: string
	filename = 'package.json'

	isPrivate: PackageJson['private']
	dependencies: PackageJson['dependencies'] = {}
	scripts: NonNullable<PackageJson['scripts']> = {}
	workspaces: NonNullable<PackageJson['workspaces']> = []

	constructor(directoryPathname: string) {
		this.directoryPathname = directoryPathname
	}

	static buildCommandSequence(workspaces: Repository['workspaces']) {
		const workspacePathnames = Array.from(workspaces.keys()).filter(RepositoryPackageJson.onlyWorkspacesWithBuild(workspaces))

		const dependenciesMap = new Map<string, string[]>()
		for (const workspacePathname of workspacePathnames) {
			const dependencies = WorkspacePackageJson.internalDependenciesChain(
				workspacePathname, workspaces
			).map(WorkspacePackageJson.workspacePathnameFromInternalDependency)
			dependenciesMap.set(workspacePathname, dependencies)
		}

		function levelOf (dependency: string): number {
			const dependencies = dependenciesMap.get(dependency) ?? []
			if (dependencies.length == 0) return 0
			let max = 0
			for (const dep of dependencies) {
				max = Math.max(levelOf(dep), max)
			}
			return max + 1
		}

		return workspacePathnames.sort((a, b) => levelOf(a) > levelOf(b) ? 1 : -1).map(
			(workspacePathname) => RepositoryPackageJson.workspaceBuildCommand(workspacePathname)
		).join(' && ')
	}

	static onlyWorkspacesWithBuild(workspaces: Repository['workspaces']) {
		return (workspacePathname: string) => {
			const workspace = workspaces.get(workspacePathname)
			if (!workspace) throw Error()
			return workspace.packageJson.buildScriptCommand
		}
	}

	static workspaceBuildScriptKey(workspacePathname: string) {
		return `${RepositoryPackageJson.buildScriptKey}:${workspacePathname}`
	}

	static workspaceBuildCommand(workspacePathname: string) {
		return `npm run ${WorkspacePackageJson.buildScriptKey} -w ${workspacePathname}`
	}

	static workspacePrebuildCommand(workspacePathname: string) {
		return `npm run build_workspace_dependencies -w repository ${workspacePathname}`
	}

	static workspacePrebuildCommandSequence(
		internalDependenciesChain: string[],
		workspaces: Repository['workspaces']
	) {
		return internalDependenciesChain
			.map((internalDependency) => WorkspacePackageJson.workspacePathnameFromInternalDependency(internalDependency))
			.filter(RepositoryPackageJson.onlyWorkspacesWithBuild(workspaces))
			.map((workspacePathname) => RepositoryPackageJson.workspaceBuildCommand(workspacePathname)).join(' && ')
	}

	static workspacePrebuildScriptKey(workspacePathname: string) {
		return `prebuild:${workspacePathname}`
	}

	async read() {
		const {
			dependencies, private: isPrivate, scripts, workspaces
		} = await readFile<PackageJson>(join(this.directoryPathname, this.filename))
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
