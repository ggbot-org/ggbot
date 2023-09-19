import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Webapp } from "./Webapp.js"

const webapp = new Webapp()

describe("Webapp", () => {
	describe("S3 Bucket", () => {
		test("exists", async () => {
			const exists = await webapp.s3Bucket.exists()
			assert.ok(exists)
		})
	})
})
