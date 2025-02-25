import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { ApiURLs } from './api.js'

test('apiURLs', () => {
	const api = new ApiURLs('main', 'example.com')

	assert.equal(api.auth.href, 'https://api.example.com/auth')
	assert.equal(api.admin.href, 'https://api.example.com/admin')
	assert.equal(api.public.href, 'https://api.example.com/public')
	assert.equal(
		api.stripe.webhook.href,
		'https://api.example.com/stripe/webhook'
	)
	assert.equal(api.stripe.action.href, 'https://api.example.com/stripe/action')
	assert.equal(api.user.href, 'https://api.example.com/user')
})
