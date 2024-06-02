import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { IamPolicy } from "@workspace/aws-iam"

import { DevopsPolicy } from "./DevopsPolicy.js"

const devopsPolicy = new DevopsPolicy()
await devopsPolicy.read()
const { policy, policyDocument } = devopsPolicy

describe("DevopsPolicy", () => {
	test("exists", () => {
		assert.ok(policy !== undefined)
	})

	if (policy) {
		test("is attachable", () => {
			assert.ok(policy.IsAttachable)
		})

		test("has one attachment", () => {
			assert.equal(policy.AttachmentCount, 1)
		})

		// TODO
		// check it is attached to ggbot2-devops-group
	}

	if (policyDocument) {
		const findStatementByActions =
			IamPolicy.findPolicyDocumentStatementByActions(policyDocument)

		for (const [statementName, actionList] of Object.entries(
			devopsPolicy.statementAction
		)) {
			const statement = findStatementByActions(actionList)
			const exists = statement !== undefined
			describe(statementName, () => {
				test("exists", () => {
					assert.ok(
						exists,
						`devopsPolicy ${statementName} statement actions should be ${JSON.stringify(
							actionList
						)}`
					)
				})
			})

			// TODO if exists, check Resource
		}
	}
})
