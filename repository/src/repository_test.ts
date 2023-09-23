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

	describe("workspace", () => {
		for (const [
			workspacePathname,
			{ packageJson }
		] of repository.workspaces.entries()) {
			const assertionError = `check ${workspacePathname}/package.json`

			describe(`${workspacePathname} package.json`, () => {
				const { packageName, dependencies, devDependencies } =
					packageJson

				const allDependencyKeys = [
					...Array.from(dependencies.keys()),
					...Array.from(devDependencies.keys())
				]

				test("has name", () => {
					assert.ok(packageName !== "", assertionError)
				})

				test("has scope", () => {
					assert.ok(
						packageName.startsWith(
							`${WorkspacePackageJson.scope}/`
						),
						assertionError
					)
				})

				test("is private", () => {
					assert.ok(packageJson.isPrivate, assertionError)
				})

				test("does not depend on itself", () => {
					assert.ok(
						!allDependencyKeys.includes(packageName),
						assertionError
					)
				})

				test("does not have duplicated dependencies", () => {
					const seenDependency = new Set()
					for (const dependency of allDependencyKeys) {
						if (seenDependency.has(dependency))
							assert.fail(assertionError)
						seenDependency.add(dependency)
					}
				})

				test("dependencies has exact version", () => {
					const isExact = (version: string) =>
						version
							.split(".")
							.every((part) => Number.isInteger(Number(part)))
					for (const [key, value] of [
						...Array.from(dependencies.entries()),
						...Array.from(devDependencies.entries())
					])
						assert.ok(
							isExact(value),
							`${assertionError} dependency ${key} version ${value} is not exact`
						)
				})
			})
		}
	})
})
