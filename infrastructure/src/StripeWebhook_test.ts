import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { ACTIVE_TEST, SKIP_WHEN_TESTS_ARE_ACTIVE } from "./runnerOptions.js"
import { StripeWebhook } from "./StripeWebhook.js"

const webhook = new StripeWebhook()
const exists = await webhook.exists()

describe("StripeWebhook", () => {
	test("exists", SKIP_WHEN_TESTS_ARE_ACTIVE, () => {
		assert.ok(exists, `StripeWebhook ${webhook.url} does not exist`)
	})

	if (!exists) {
		test(`create StripeWebhook ${webhook.url}`, ACTIVE_TEST, async () => {
			const endpoint = await webhook.create()
			console.info(endpoint)
			assert.ok(true)
		})
	}

	if (exists) {
		test("apiVersion", () => {
			assert.equal(
				webhook.endpoint?.api_version,
				StripeWebhook.apiVersion
			)
		})

		test("status is enabled", () => {
			assert.equal(webhook.endpoint?.status, "enabled")
		})

		test("has enabled events", () => {
			assert.deepEqual(
				webhook.endpoint?.enabled_events,
				StripeWebhook.enabledEvents
			)
		})

		// TODO check livemode is false if DEPLOY_STAGE is local or next
		// TODO check livemode is true if DEPLOY_STAGE is main
		// add a `get livemode ()` to StripeWebhook
	}
})
