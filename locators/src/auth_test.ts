import { strict as assert } from "node:assert"
import { test } from "node:test"

import { AuthURLs } from "./auth.js"

void test("authURLs", () => {
	const auth = new AuthURLs("main", "example.com")

	assert.equal(auth.enter.href, "https://auth.example.com/enter")
})