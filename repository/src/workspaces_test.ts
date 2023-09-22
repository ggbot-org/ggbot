import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Repository } from "./Repository.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const repository = new Repository()
await repository.read()

describe("workspace", () => {
	for (const [
		workspacePathname,
		{ packageJson }
	] of repository.workspaces.entries()) {
		const assertionError = `check ${workspacePathname}/package.json`

		describe(`${workspacePathname} package.json`, () => {
			const { packageName, dependencies, devDependencies } = packageJson

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
