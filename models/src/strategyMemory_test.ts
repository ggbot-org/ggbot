import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { MaybeObject } from 'minimal-type-guard-helpers'

import { isStrategyMemory, StrategyMemory } from './strategyMemory.js'
import { invalidIdentifierStrings } from './strings_test.js'

test('isStrategyMemory', () => {
	type TestData = Array<{
		input: MaybeObject<StrategyMemory>;
		output: boolean;
	}>
	const testData: TestData = [
		{
			input: {},
			output: true,
		},
		{
			input: {
				'label 1': true,
				'label 2': 123,
				label3: 'hello world',
			},
			output: true,
		},
		...invalidIdentifierStrings.map((key) => ({
			input: { [key]: 'value' },
			output: false,
		})),
	]

	for (const { input, output } of testData) {
		assert.equal(isStrategyMemory(input), output)
	}
})
