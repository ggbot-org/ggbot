import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import {
	rootPackageJson,
	rootPackageJsonWorkspaceScriptKey
} from "./old_rootPackage.js"
import { workspaceExposedScriptKeys } from "./old_workspacePackage.js"
import { workspaceNames } from "./old_workspaces.js"

const { scripts } = rootPackageJson

describe("root package.json", () => {
	describe("scripts", () => {
		it("is sorted by key", () => {
			const keys = Object.keys(scripts)
			const sorted = keys.slice(0).sort()
			assert.equal(
				keys.join(),
				sorted.join(),
				"root package.json scripts are not sorted by key"
			)
		})

		it("has workspace tasks properly defined", () => {
			Object.keys(scripts).forEach((scriptKey) => {
				for (const workspaceScriptKey of workspaceExposedScriptKeys) {
					if (
						!scriptKey.startsWith(
							rootPackageJsonWorkspaceScriptKey(
								workspaceScriptKey,
								""
							)
						)
					)
						return
					assert.ok(
						workspaceNames
							.map((workspace) =>
								rootPackageJsonWorkspaceScriptKey(
									workspaceScriptKey,
									workspace
								)
							)
							.includes(scriptKey),
						`script ${scriptKey} does not target a workspace`
					)
				}
			})
		})
	})

	describe("workspaces", () => {
		it("is sorted", () => {
			const sorted = workspaceNames.slice(0).sort()
			assert.equal(
				workspaceNames.join(),
				sorted.join(),
				"root package.json workspaces are not sorted"
			)
		})
	})
})
