import { strict as assert } from "node:assert"
import { test } from "node:test"

import { nullStrategyKey as strategyKey } from "@workspace/models"

import { WebappURLs } from "./webapp.js"

void test("WebappURLs", () => {
	const webapp = new WebappURLs("main", "example.com")

	assert.equal(webapp.homepage.href, "https://www.example.com/index.html")
	assert.equal(webapp.privacy.href, "https://www.example.com/privacy.html")
	assert.equal(webapp.terms.href, "https://www.example.com/terms.html")
	assert.equal(
		webapp.purchaseCanceled.href,
		"https://www.example.com/purchase-canceled.html"
	)
	assert.equal(
		webapp.subscriptionPurchased.href,
		"https://www.example.com/subscription-purchased.html"
	)
	assert.equal(
		webapp.strategy(strategyKey).href,
		"https://www.example.com/strategy.html?strategyId=00000000&strategyKind=none"
	)

	assert.equal(
		webapp.user.dashboard.href,
		"https://www.example.com/user/dashboard.html"
	)
	assert.equal(
		webapp.user.copyStrategy(strategyKey).href,
		"https://www.example.com/user/copy-strategy.html?strategyId=00000000&strategyKind=none"
	)
	assert.equal(
		webapp.user.editStrategy(strategyKey).href,
		"https://www.example.com/user/edit-strategy.html?strategyId=00000000&strategyKind=none"
	)
	assert.equal(
		webapp.user.strategy(strategyKey).href,
		"https://www.example.com/user/strategy.html?strategyId=00000000&strategyKind=none"
	)

	assert.equal(
		webapp.admin.dashboard.href,
		"https://www.example.com/admin/dashboard.html"
	)
})
