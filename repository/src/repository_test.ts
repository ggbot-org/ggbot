import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Repository } from "./Repository.js"
import { RepositoryPackageJson } from "./RepositoryPackageJson.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const repository = new Repository()
await repository.read()

void describe("repository", () => {
	void describe("package.json", () => {
		const { packageJson, workspaces } = repository
		void test("is private", () => {
			assert.equal(packageJson.isPrivate, true)
		})

		void describe("script", () => {
			for (const workspacePathname of packageJson.workspaces) {
				const buildScript =
					packageJson.workspaceBuildScriptCommand(workspacePathname)
				if (!buildScript) continue
				const buildScriptKey =
					RepositoryPackageJson.workspaceBuildScriptKey(
						workspacePathname
					)
				void describe(buildScriptKey, () => {
					const assertionError = `check repository package.json ${buildScriptKey} script`
					void test("has expected command", () => {
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
				void describe(prebuildScriptKey, () => {
					const assertionError = `check repository package.json ${prebuildScriptKey} script`
					void test("has expected command", () => {
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
							assert.equal(
								prebuildScript,
								RepositoryPackageJson.workspacePrebuildCommand(
									workspacePathname
								),
								assertionError
							)
						}
					})
				})
			}
		})
	})

	void describe("workspace", () => {
		for (const [
			workspacePathname,
			{ packageJson }
		] of repository.workspaces.entries()) {
			const assertionError = `check ${workspacePathname}/package.json`

			void describe(`${workspacePathname} package.json`, () => {
				const { packageName, dependencies, devDependencies } =
					packageJson

				const allDependencyKeys = [
					...Array.from(dependencies.keys()),
					...Array.from(devDependencies.keys())
				]

				void test("has name", () => {
					assert.ok(packageName !== "", assertionError)
				})

				void test("has scope", () => {
					assert.ok(
						packageName.startsWith(
							`${WorkspacePackageJson.scope}/`
						),
						assertionError
					)
				})

				void test("is private", () => {
					assert.ok(packageJson.isPrivate, assertionError)
				})

				void test("does not depend on itself", () => {
					assert.ok(
						!allDependencyKeys.includes(packageName),
						assertionError
					)
				})

				void test("does not have duplicated dependencies", () => {
					const seenDependency = new Set()
					for (const dependency of allDependencyKeys) {
						if (seenDependency.has(dependency))
							assert.fail(assertionError)
						seenDependency.add(dependency)
					}
				})

				void test("dependencies has exact version", () => {
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
