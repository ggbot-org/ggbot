import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { RepositoryPackageJson } from "./RepositoryPackageJson.js"
import { repositoryPackageJsons } from "./repositoryPackages.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const { repositoryPackageJson, workspaceMap } = await repositoryPackageJsons()

describe("repository package.json", () => {
	test("is private", () => {
		assert.equal(repositoryPackageJson.isPrivate, true)
	})

	describe("script", () => {
		for (const workspaceDir of repositoryPackageJson.workspaces) {
			const buildScript =
				repositoryPackageJson.workspaceBuildScriptCommand(workspaceDir)
			if (!buildScript) continue
			const buildScriptKey =
				RepositoryPackageJson.workspaceBuildScriptKey(workspaceDir)
			describe(buildScriptKey, () => {
				const assertionError = `check root package.json ${buildScriptKey} script`
				test("has expected command", () => {
					const workspace = workspaceMap.get(workspaceDir)
					if (!workspace) throw Error()
					if (workspace.buildScriptCommand) {
						assert.equal(
							RepositoryPackageJson.workspaceBuildCommand(
								workspaceDir
							),
							buildScript,
							assertionError
						)
					} else {
						assert.equal(buildScript, undefined, assertionError)
					}
				})
			})

			const prebuildScriptKey =
				RepositoryPackageJson.workspacePrebuildScriptKey(workspaceDir)
			describe(prebuildScriptKey, () => {
				const assertionError = `check root package.json ${prebuildScriptKey} script`
				test("has expected command", () => {
					const workspace = workspaceMap.get(workspaceDir)
					if (!workspace) throw Error()
					const prebuildScript =
						repositoryPackageJson.workspacePrebuildScriptCommand(
							workspaceDir
						)
					if (workspace.internalDependencies.size === 0) {
						assert.equal(prebuildScript, undefined, assertionError)
					} else {
						const internalDependenciesChain =
							WorkspacePackageJson.internalDependenciesChain(
								workspaceDir,
								workspaceMap
							)
						assert.equal(
							prebuildScript,
							RepositoryPackageJson.workspacePrebuildCommandSequence(
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
