import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { everyOneHour, frequenciesAreEqual } from './frequency.js'

test('frequenciesAreEqual', () => {
	type TestData = Array<{
		input: Parameters<typeof frequenciesAreEqual>
		output: boolean
	}>

	const testData: TestData = [
		{
			input: [everyOneHour(), undefined],
			output: false,
		},
		{
			input: [everyOneHour(), everyOneHour()],
			output: true,
		},
	]
	for (const { input, output } of testData) {
		assert.equal(frequenciesAreEqual(...input), output)
	}
})
