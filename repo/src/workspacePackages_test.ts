import { strict as assert } from "node:assert"
import { join } from "node:path"
import { describe, it } from "node:test"

import { PackageJson } from "type-fest"

import { repoDir } from "./repoDir.js"
import { RepoPackageJson } from "./RepoPackageJson.js"
import { WorkspacePackageJson } from "./WorkspacePackageJson.js"

const repoPackage = new RepoPackageJson(repoDir)
await repoPackage.read()

const workspaceMap = new Map<
	PackageJson.WorkspacePattern,
	WorkspacePackageJson
>()

for (const workspaceDir of repoPackage.workspaces) {
	const workspacePackageJson = new WorkspacePackageJson(
		join(repoDir, workspaceDir)
	)
	await workspacePackageJson.read()
	workspaceMap.set(workspaceDir, workspacePackageJson)
}

describe("workspace", () => {
	for (const [workspaceDir, workspacePackageJson] of workspaceMap.entries()) {
		const assertionError = `check ${workspaceDir}/package.json`

		describe(`${workspaceDir} package.json`, () => {
			const packageName = workspacePackageJson.packageName ?? ""

			const dependencies = workspacePackageJson.dependencies ?? {}
			const devDependencies = workspacePackageJson.devDependencies ?? {}
			const allDependencyKeys = Object.keys({
				...dependencies,
				...devDependencies
			})

			it("has name", () => {
				assert.ok(packageName !== "", assertionError)
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
		})
	}
})
