import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { repoPackages } from "./repoPackages.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const { workspaceMap } = await repoPackages()

describe("workspace", () => {
	for (const [workspaceDir, workspacePackageJson] of workspaceMap.entries()) {
		const assertionError = `check ${workspaceDir}/package.json`

		describe(`${workspaceDir} package.json`, () => {
			const packageName = workspacePackageJson.packageName

			const allDependencyKeys = [
				...Array.from(workspacePackageJson.dependencies.keys()),
				...Array.from(workspacePackageJson.devDependencies.keys())
			]

			it("has name", () => {
				assert.ok(packageName !== "", assertionError)
			})

			it("has scope", () => {
				assert.ok(
					packageName.startsWith(`${WorkspacePackageJson.scope}/`),
					assertionError
				)
			})

			it("is private", () => {
				assert.ok(workspacePackageJson.isPrivate, assertionError)
			})

			it("does not depend on itself", () => {
				assert.ok(
					!allDependencyKeys.includes(packageName),
					assertionError
				)
			})

			it("does not have duplicated dependencies", () => {
				const seenDependency = new Set()
				for (const dependency of allDependencyKeys) {
					if (seenDependency.has(dependency))
						assert.fail(assertionError)
					seenDependency.add(dependency)
				}
			})
		})
	}
})
