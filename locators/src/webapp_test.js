import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { FQDN } from './FQDNs.js'
import { WebappBaseURL, WebappURLs } from './webapp.js'

/** @type {import('@workspace/models').StrategyKey} */
const strategyKey = {
	strategyId: '12345678',
	strategyKind: 'none'
}

test('WebappURLs', () => {
	const baseURL = new WebappBaseURL(new FQDN('main', 'example.com'))
	const webapp = new WebappURLs(baseURL)

	// Public

	assert.equal(webapp.homepage.href, 'https://www.example.com/index.html')
	assert.equal(webapp.privacy.href, 'https://www.example.com/privacy.html')
	assert.equal(webapp.terms.href, 'https://www.example.com/terms.html')
	assert.equal(webapp.purchaseCanceled.href, 'https://www.example.com/purchase-canceled.html')
	assert.equal(webapp.subscriptionPurchased.href, 'https://www.example.com/subscription-purchased.html')
	assert.equal(webapp.strategy(strategyKey).href, 'https://www.example.com/strategy.html?strategyId=12345678&strategyKind=none')

	// User

	assert.equal(webapp.user.dashboard.href, 'https://www.example.com/user/dashboard.html')
	assert.equal(webapp.user.copyStrategy(strategyKey).href, 'https://www.example.com/user/copy-strategy.html?strategyId=12345678&strategyKind=none')
	assert.equal(webapp.user.editStrategy(strategyKey).href, 'https://www.example.com/user/edit-strategy.html?strategyId=12345678&strategyKind=none')
	assert.equal(webapp.user.settings.href, 'https://www.example.com/user/settings.html')
	assert.equal(webapp.user.strategy(strategyKey).href, 'https://www.example.com/user/strategy.html?strategyId=12345678&strategyKind=none')

	// Admin

	assert.equal(webapp.admin.accountDetails({ accountId: '12345678' }).href, 'https://www.example.com/admin/account-details.html?accountId=12345678')
	assert.equal(webapp.admin.dashboard.href, 'https://www.example.com/admin/dashboard.html')

	// Design
	assert.equal(webapp.design.showcase.href, 'https://www.example.com/design/showcase.html')
})
