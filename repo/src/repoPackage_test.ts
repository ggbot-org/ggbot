import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { RepoPackageJson } from "./RepoPackageJson.js"
import { repoPackages } from "./repoPackages.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const { repoPackage, workspaceMap } = await repoPackages()

describe("repo package.json", () => {
	it("is private", () => {
		assert.equal(repoPackage.isPrivate, true)
	})

	describe("script", () => {
		for (const workspaceDir of repoPackage.workspaces) {
			const buildScript =
				repoPackage.workspaceBuildScriptCommand(workspaceDir)
			if (!buildScript) continue
			const buildScriptKey =
				RepoPackageJson.workspaceBuildScriptKey(workspaceDir)
			describe(buildScriptKey, () => {
				const assertionError = `check root package.json ${buildScriptKey} script`
				it("has expected command", () => {
					const workspace = workspaceMap.get(workspaceDir)
					if (!workspace) throw Error()
					if (workspace.buildScriptCommand) {
						assert.equal(
							RepoPackageJson.workspaceBuildCommand(workspaceDir),
							buildScript,
							assertionError
						)
					} else {
						assert.equal(buildScript, undefined, assertionError)
					}
				})
			})

			const prebuildScriptKey =
				RepoPackageJson.workspacePrebuildScriptKey(workspaceDir)
			describe(prebuildScriptKey, () => {
				const assertionError = `check root package.json ${prebuildScriptKey} script`
				it("has expected command", () => {
					const workspace = workspaceMap.get(workspaceDir)
					if (!workspace) throw Error()
					const prebuildScript =
						repoPackage.workspacePrebuildScriptCommand(workspaceDir)
					if (workspace.internalDependencies.size === 0) {
						assert.equal(prebuildScript, undefined, assertionError)
					} else if (prebuildScript) {
						const internalDependenciesChain =
							WorkspacePackageJson.internalDependenciesChain(
								workspaceDir,
								workspaceMap
							)
						assert.equal(
							prebuildScript,
							RepoPackageJson.workspacePrebuildCommandSequence(
								internalDependenciesChain,
								workspaceMap
							),
							assertionError
						)
					}
				})
			})
		}
	})
})
