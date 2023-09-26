import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { DevopsPolicy } from "./DevopsPolicy.js"

const devopsPolicy = new DevopsPolicy()
const policy = await devopsPolicy.readPolicy()

describe("DevopsPolicy", () => {
	test("is attachable", () => {
		assert.ok(policy?.IsAttachable)
	})

	test("has one attachment", () => {
		assert.equal(policy?.AttachmentCount, 1)
	})
	// TODO read policy version and eventually create new one
	// const versionId = policy?.DefaultVersionId
})
