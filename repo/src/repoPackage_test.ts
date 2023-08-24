import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { repoDir } from "./repoDir.js"
import { RepoPackageJson } from "./RepoPackageJson.js"

const repoPackage = new RepoPackageJson(repoDir)
await repoPackage.read()

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
					assert.equal(
						RepoPackageJson.workspaceBuildCommand(workspaceDir),
						buildScript,
						assertionError
					)
				})
			})
		}
	})
})
