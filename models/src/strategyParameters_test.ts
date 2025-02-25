import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isStrategyParameters } from './strategyParameters.js'
import { invalidIdentifierStrings } from './strings_test.js'

const invalidValues = ['', Infinity, []]

test('isStrategyParameters', () => {
	for (const { input, output } of [
		{
			input: {},
			output: true,
		},
		{
			input: {
				'param 1': true,
				'param 2': 123,
				param3: 'hello world',
			},
			output: true,
		},
		...invalidIdentifierStrings.map((key) => ({ input: { [key]: 'value' }, output: false })),
		...invalidValues.map((invalidValue) => ({ input: { key: invalidValue }, output: false })),
	]) {
		assert.equal(isStrategyParameters(input), output)
	}
})
