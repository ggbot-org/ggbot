import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isName } from './name.js'

const nameTooLong = 'x'.repeat(999)
export const invalidNames = ['', '     ', nameTooLong]

test('isName', () => {
	for (const { input, output } of [
		{ input: 'valid name', output: true },
		...invalidNames.map((input) => ({ input, output: false })),
	]) {
		assert.equal(isName(input), output)
	}
})
