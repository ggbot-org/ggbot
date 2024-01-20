import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { ACTIVE_TEST } from "./runnerOptions.js"
import { UrlShortener } from "./UrlShortener.js"

const urlShortener = new UrlShortener()

void describe("UrlShortener", () => {
	void describe("S3 Bucket", () => {
		const { s3Bucket } = urlShortener

		void test(`${s3Bucket.name} exists`, async () => {
			const exists = await s3Bucket.exists()
			assert.ok(exists, `S3 bucket ${s3Bucket.name} does not exist`)
		})

		void test(`create ${s3Bucket.name}`, ACTIVE_TEST, async () => {
			await s3Bucket.create()
			assert.ok(true)
		})
	})
})
