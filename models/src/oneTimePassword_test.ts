import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { assertEqual } from 'minimal-assertion-helpers'
import { MaybeObject } from 'minimal-type-guard-helpers'

import { generateOneTimePassword, isOneTimePassword, OneTimePassword } from './oneTimePassword.js'
import { createdNow } from './time.js'

test('isOneTimePassword', () => {
	assertEqual<MaybeObject<OneTimePassword>, boolean>(isOneTimePassword, [
		{
			input: { code: '123456', ...createdNow() },
			output: true
		}
	])
})

test('generateOneTimePassword', () => {
	assert.ok(isOneTimePassword(generateOneTimePassword()))
})
