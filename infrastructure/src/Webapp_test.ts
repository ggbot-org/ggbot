import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { ACTIVE_TEST, SKIP_WHEN_TESTS_ARE_ACTIVE } from "./runnerOptions.js"
import { Webapp } from "./Webapp.js"

const webapp = new Webapp()

describe("Webapp", () => {
	describe("S3 Bucket", () => {
		const { s3Bucket } = webapp

		test(
			`${s3Bucket.name} exists`,
			SKIP_WHEN_TESTS_ARE_ACTIVE,
			async () => {
				const exists = await s3Bucket.exists()
				assert.ok(exists, `S3 bucket ${s3Bucket.name} does not exist`)
			}
		)

		test(`create ${s3Bucket.name}`, ACTIVE_TEST, async () => {
			await s3Bucket.create()
			assert.ok(true)
		})
	})
})
