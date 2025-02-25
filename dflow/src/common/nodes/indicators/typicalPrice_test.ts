import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { typicalPrice } from './typicalPrice.js'

type TypicalPrice = typeof typicalPrice
type TypicalPriceInput = {
	high: Parameters<TypicalPrice>[0]
	low: Parameters<TypicalPrice>[1]
	close: Parameters<TypicalPrice>[2]
}

test('Typical Price', () => {
	type TestData = Array<{
		input: TypicalPriceInput
		output: ReturnType<TypicalPrice>
	}>
	const testData: TestData = [
		{ input: { high: 0, low: 0, close: 0 }, output: 0 },
		{ input: { high: 10, low: 20, close: 30 }, output: 20 },
		{ input: { high: 10.12, low: 10.23, close: 10.34 }, output: 10.23 },
	]

	for (const { input, output } of testData) {
		assert.equal(typicalPrice(input.high, input.low, input.close), output)
	}
})
