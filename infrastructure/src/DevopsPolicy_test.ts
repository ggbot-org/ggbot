import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

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
		const readResourcesStatement = policyDocument.Statement.find(
			({ Action }) => {
				Action.sort().join() ===
					devopsPolicy.readResourcesStatementActions.join()
			}
		)

		describe("read resouce statement", () => {
			test("exists", () => {
				assert.ok(!readResourcesStatement)
			})
		})

		// TODO check all other statements
	}
})
