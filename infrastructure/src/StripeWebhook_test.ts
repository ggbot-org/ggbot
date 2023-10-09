import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { StripeWebhook } from "./StripeWebhook.js"

const webhook = new StripeWebhook()
// TODO list webhooks and check it exists by URL
const exists = webhook !== undefined

describe("SesNoreplyPolicy", () => {
	test("exists", () => {
		assert.ok(exists)
	})

	if (exists) {
		// TODO
		// test("has enabled_events", () => { })
	}
})
