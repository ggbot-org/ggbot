import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { ACTIVE_TEST } from "./runnerOptions.js"
import { Webapp } from "./Webapp.js"

const webapp = new Webapp()

describe("Webapp", () => {
	describe("S3 Bucket", () => {
		test("exists", async () => {
			const exists = await webapp.s3Bucket.exists()
			assert.ok(exists)
		})

		test("create", ACTIVE_TEST, async () => {
			const exists = await webapp.s3Bucket.exists()
			if (!exists) {
				await webapp.s3Bucket.createIfItDoesExist()
			}
			assert.ok(true)
		})
	})
})
