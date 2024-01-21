import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { IamPolicy } from "@workspace/aws-iam"

import { ElasticIpsPolicy } from "./ElasticIpsPolicy.js"

const elasticIpsPolicy = new ElasticIpsPolicy()
await elasticIpsPolicy.read()
const { policy, policyDocument } = elasticIpsPolicy

void describe("ElasticIpsPolicy", () => {
	void test("exists", () => {
		assert.ok(policy !== undefined)
	})

	if (policy) {
		void test("is attachable", () => {
			assert.ok(policy.IsAttachable)
		})

		void test("has one attachment", () => {
			assert.equal(policy.AttachmentCount, 1)
		})

		// TODO
		// check it is attached to ggbot2-binance-proxy-role
	}

	if (policyDocument) {
		const findStatementByActions =
			IamPolicy.findPolicyDocumentStatementByActions(policyDocument)

		for (const [statementName, actionList] of Object.entries(
			elasticIpsPolicy.statementAction
		)) {
			const statement = findStatementByActions(actionList)
			const exists = statement !== undefined
			void describe(statementName, () => {
				void test("exists", () => {
					assert.ok(
						exists,
						`elasticIpsPolicy ${statementName} statement actions should be ${JSON.stringify(
							actionList
						)}`
					)
				})
			})

			// TODO if exists, check Resource
		}
	}
})
