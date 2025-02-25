import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { parsePercentage } from './nodeTextParser.js'

test('parsePercentage', () => {
	type TestData = Array<{
		input: string;
		output: number;
	}>
	const testData: TestData = [
		{ input: '1%', output: 0.01 },
		{ input: '-1%', output: -0.01 },
		{ input: '42%', output: 0.42 },
		{ input: '0.1%', output: 0.001 },
		{ input: '2.01%', output: 0.0201 },
		{ input: '+2%', output: 0.02 },
		{ input: '1 %', output: 0.01 },
		{ input: ' 1 %', output: 0.01 },
		{ input: '1 % ', output: 0.01 },
		{ input: '- 1%', output: -0.01 },
		{ input: '-1 %', output: -0.01 },
		{ input: '- 1 %', output: -0.01 },
	]

	for (const { input, output } of testData) {
		assert.equal(parsePercentage(input), output)
	}
})
