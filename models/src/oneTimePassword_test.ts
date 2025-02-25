import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { generateOneTimePassword, isOneTimePassword } from './oneTimePassword.js'
import { createdNow } from './time.js'

test('isOneTimePassword', () => {
	for (const { input, output } of [
		{
			input: { code: '123456', ...createdNow() },
			output: true,
		},
	]) {
		assert.equal(isOneTimePassword(input), output)
	}
})

test('generateOneTimePassword', () => {
	assert.ok(isOneTimePassword(generateOneTimePassword()))
})
