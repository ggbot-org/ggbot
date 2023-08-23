import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import {
	rootPackageJson,
	rootPackageJsonWorkspaceScriptKey
} from "./old_rootPackage.js"
import {
	importWorkspacePackageJson,
	workspaceExposedScriptKeys
} from "./old_workspacePackage.js"
import { workspaceNames } from "./old_workspaces.js"

const { scripts: rootPackageJsonScripts } = rootPackageJson

workspaceNames.forEach(async (workspace) => {
	const packageJson = await importWorkspacePackageJson(workspace)

	describe(`${workspace} package.json`, () => {
		it("is private", () => {
			assert.equal(
				packageJson.private,
				true,
				`${workspace} package.json is not private`
			)
		})

		describe("scripts", () => {
			const { scripts } = packageJson
			if (!scripts) return

			it("is sorted by key", () => {
				const keys = Object.keys(scripts)
				const sorted = keys.slice(0).sort()
				assert.equal(
					keys.join(),
					sorted.join(),
					`${workspace} package.json scripts are not sorted by key`
				)
			})

			for (const scriptKey of workspaceExposedScriptKeys) {
				if (!scripts[scriptKey]) continue

				const rootPackageScriptKey = rootPackageJsonWorkspaceScriptKey(
					scriptKey,
					workspace
				)

				it(`has ${scriptKey} script exposed by root package.json as ${rootPackageScriptKey}`, () => {
					assert.ok(
						typeof rootPackageJsonScripts[rootPackageScriptKey] ===
							"string",
						`script ${scriptKey} in ${workspace}/package.json is not exposed by root package.json as ${rootPackageScriptKey}`
					)
				})
			}
		})
	})
})
