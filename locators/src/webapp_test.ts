import { strict as assert } from "node:assert"
import { test } from "node:test"

import { WebappURLs } from "./webapp.js"

void test("WebappURLs", () => {
	const webapp = new WebappURLs("main", "example.com")

	assert.equal(webapp.homepage.href, "https://www.example.com/index.html")
	assert.equal(webapp.privacy.href, "https://www.example.com/privacy.html")
	assert.equal(webapp.terms.href, "https://www.example.com/terms.html")
})
