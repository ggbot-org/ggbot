import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { typicalPrice } from "./typicalPrice.js"

type TypicalPrice = typeof typicalPrice
type TypicalPriceInput = {
	high: Parameters<TypicalPrice>[0]
	low: Parameters<TypicalPrice>[1]
	close: Parameters<TypicalPrice>[2]
}

test("Typical Price", () => {
	assertDeepEqual<TypicalPriceInput, ReturnType<TypicalPrice>>(
		({ high, low, close }: TypicalPriceInput) => typicalPrice(high, low, close),
		[
			{ input: { high: 0, low: 0, close: 0 }, output: 0 },
			{ input: { high: 10, low: 20, close: 30 }, output: 20 },
			{ input: { high: 10.12, low: 10.23, close: 10.34 }, output: 10.23 }
		]
	)
})
