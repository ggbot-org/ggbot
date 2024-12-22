import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isTime } from 'minimal-time-helpers'
import { objectTypeGuard } from 'minimal-type-guard-helpers'

import { generateOneTimePassword, isOneTimePasswordCode, OneTimePassword } from './oneTimePassword.js'

const isOneTimePassword = objectTypeGuard<OneTimePassword>(
	({ code, whenCreated }) => isOneTimePasswordCode(code) && isTime(whenCreated)
)

test('generateOneTimePassword', () => {
	assert.ok(isOneTimePassword(generateOneTimePassword()))
})
