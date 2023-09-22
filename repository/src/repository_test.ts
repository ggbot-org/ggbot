import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Repository } from "./Repository.js"
import { RepositoryPackageJson } from "./RepositoryPackageJson.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const repository = new Repository()
await repository.read()

describe("repository", () => {
	describe("package.json", () => {
		const { packageJson, workspaces } = repository
		test("is private", () => {
			assert.equal(packageJson.isPrivate, true)
		})

		describe("script", () => {
			for (const workspacePathname of packageJson.workspaces) {
				const buildScript =
					packageJson.workspaceBuildScriptCommand(workspacePathname)
				if (!buildScript) continue
				const buildScriptKey =
					RepositoryPackageJson.workspaceBuildScriptKey(
						workspacePathname
					)
				describe(buildScriptKey, () => {
					const assertionError = `check repository package.json ${buildScriptKey} script`
					test("has expected command", () => {
						const workspace = workspaces.get(workspacePathname)
						if (!workspace) throw Error()
						if (workspace.packageJson.buildScriptCommand) {
							assert.equal(
								RepositoryPackageJson.workspaceBuildCommand(
									workspacePathname
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
					RepositoryPackageJson.workspacePrebuildScriptKey(
						workspacePathname
					)
				describe(prebuildScriptKey, () => {
					const assertionError = `check repository package.json ${prebuildScriptKey} script`
					test("has expected command", () => {
						const workspace = workspaces.get(workspacePathname)
						if (!workspace) throw Error()
						const prebuildScript =
							packageJson.workspacePrebuildScriptCommand(
								workspacePathname
							)
						if (
							workspace.packageJson.internalDependencies.size ===
							0
						) {
							assert.equal(
								prebuildScript,
								undefined,
								assertionError
							)
						} else {
							const internalDependenciesChain =
								WorkspacePackageJson.internalDependenciesChain(
									workspacePathname,
									workspaces
								)
							assert.equal(
								prebuildScript,
								RepositoryPackageJson.workspacePrebuildCommandSequence(
									internalDependenciesChain,
									workspaces
								),
								assertionError
							)
						}
					})
				})
			}
		})
	})
})
