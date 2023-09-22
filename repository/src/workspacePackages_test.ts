import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { repositoryPackageJsons } from "./repositoryPackages.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const { workspaceMap } = await repositoryPackageJsons()

describe("workspace", () => {
	for (const [workspaceDir, workspacePackageJson] of workspaceMap.entries()) {
		const assertionError = `check ${workspaceDir}/package.json`

		describe(`${workspaceDir} package.json`, () => {
			const { packageName, dependencies, devDependencies } =
				workspacePackageJson

			const allDependencyKeys = [
				...Array.from(dependencies.keys()),
				...Array.from(devDependencies.keys())
			]

			test("has name", () => {
				assert.ok(packageName !== "", assertionError)
			})

			test("has scope", () => {
				assert.ok(
					packageName.startsWith(`${WorkspacePackageJson.scope}/`),
					assertionError
				)
			})

			test("is private", () => {
				assert.ok(workspacePackageJson.isPrivate, assertionError)
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
