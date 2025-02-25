import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isAccount, newAccount } from './account.js'
import { nullId } from './item.js'
import { createdNow } from './time.js'

test('isAccount', () => {
	const email = 'user@example.com'
	const { whenCreated } = createdNow()
	for (const { input, output } of [
		{
			input: newAccount({ email }),
			output: true,
		},
		{
			input: { id: 'not an id', email, whenCreated },
			output: false,
		},
		{
			input: { id: nullId, email: 'not an email', whenCreated },
			output: false,
		},
		{
			input: {
				id: nullId,
				email,
				whenCreated: 'not a timestamp',
			},
			output: false,
		},
	]) {
		assert.equal(isAccount(input), output)
	}
})
