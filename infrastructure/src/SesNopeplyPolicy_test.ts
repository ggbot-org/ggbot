import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { SesNoreplyPolicy } from "./SesNopeplyPolicy.js"

const sesNoreplyPolicy = new SesNoreplyPolicy()
await sesNoreplyPolicy.read()
const { policy } = sesNoreplyPolicy

void describe("SesNoreplyPolicy", () => {
	void test("exists", () => {
		assert.ok(policy !== undefined)
	})

	if (policy) {
		void test("is attachable", () => {
			assert.ok(policy.IsAttachable)
		})

		// TODO
		// test("has one attachment", () => {
		// 	assert.equal(policy.AttachmentCount, 1)
		// })

		// TODO
		// check it is attached to api role

		// TODO read policy version and eventually create new one
		// const versionId = policy?.DefaultVersionId
	}
})
