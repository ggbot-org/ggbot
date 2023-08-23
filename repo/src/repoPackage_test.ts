import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { repoPackage } from "./repoPackage.js"
import { RepoPackageJson } from "./RepoPackageJson.js"

describe("repo package.json", () => {
	it("is private", () => {
		assert.equal(repoPackage.isPrivate, true)
	})

	describe("script", () => {
		for (const workspace of repoPackage.workspaces) {
			const buildScript =
				repoPackage.workspaceBuildScriptCommand(workspace)
			if (!buildScript) continue
			describe(RepoPackageJson.workspaceBuildScriptKey(workspace), () => {
				it("has expected command", () => {
					assert(
						RepoPackageJson.workspaceBuildCommand(workspace),
						buildScript
					)
				})
			})
		}
	})
})
