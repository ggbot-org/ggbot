import { strict as assert } from "node:assert"
import { test } from "node:test"

import { ApiURLs } from "./api.js"

void test("apiURLs", () => {
	const api = new ApiURLs("main", "example.com")

	assert.equal(api.user.action.href, "https://api.example.com/user/action")
})
