import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isItemId } from './item.js'

export const invalidId = 'not an id'

test('isItemId', () => {
	type TestData = Array<{
		input: unknown
		output: boolean
	}>
	const testData: TestData = [
		{ input: undefined, output: false },
		{ input: 1000, output: false },
		{ input: '', output: false },
		{ input: '12345678', output: true },
		{ input: invalidId, output: false },
	]

	for (const { input, output } of testData) {
		assert.equal(isItemId(input), output)
	}
})
