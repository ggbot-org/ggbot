import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { relativeStrengthIndex } from './relativeStrengthIndex.js'

type RelativeStrengthIndex = typeof relativeStrengthIndex
type RelativeStrengthIndexInput = {
	values: Parameters<RelativeStrengthIndex>[0]
	period: Parameters<RelativeStrengthIndex>[1]
}

test('Relative Strength Index', () => {
	type TestData = Array<{
		input: RelativeStrengthIndexInput
		output: ReturnType<RelativeStrengthIndex>
	}>
	const testData: TestData = [
		{
			input: {
				values: [1, 2],
				period: 3,
			},
			output: [],
		},
		{
			input: {
				values: [
					81.59, 81.06, 82.87, 83.0, 83.61, 83.15, 82.84, 83.99, 84.55, 84.36,
					85.53, 86.54, 86.89, 87.77, 87.29,
				],
				period: 5,
			},
			output: [
				72.033898, 64.926798, 75.936238, 79.796498, 74.713414, 83.03286,
				87.478287, 88.754544, 91.482854, 78.497831,
			],
		},
	]

	for (const { input, output } of testData) {
		assert.deepEqual(relativeStrengthIndex(input.values, input.period), output)
	}
})
