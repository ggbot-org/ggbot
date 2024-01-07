import { strict as assert } from "node:assert"
import { test } from "node:test"

import { ApiURLs } from "./api.js"

void test("apiURLs", () => {
	const api = new ApiURLs("main", "example.com")

	assert.equal(api.admin.action.href, "https://api.example.com/admin/action")
	assert.equal(
		api.public.action.href,
		"https://api.example.com/public/action"
	)
	assert.equal(
		api.stripe.webhook.href,
		"https://api.example.com/stripe/webhook"
	)
	assert.equal(api.user.action.href, "https://api.example.com/user/action")
})
