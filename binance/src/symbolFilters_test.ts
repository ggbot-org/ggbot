import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { lotSizeIsValid, minNotionalIsValid } from "./symbolFilters.js"
import { BinanceSymbolFilterLotSize, BinanceSymbolFilterMinNotional } from "./types.js"

describe("lotSizeIsValid", () => {
	test("applies LOT_SIZE symbol filter", () => {
		const filter: BinanceSymbolFilterLotSize = {
			filterType: "LOT_SIZE",
			minQty: "0.00010000",
			maxQty: "100000.00000000",
			stepSize: "0.00010000"
		}

		const validValues = ["1", "0.1"]
		const invalidValues = ["0.00000000", "0.000001", "100001.00000000"]

		const testData: Array<{
			input: { filter: BinanceSymbolFilterLotSize; value: string }
			output: boolean
		}> = [
			...validValues.map((value) => ({
				input: { filter, value },
				output: true
			})),
			...invalidValues.map((value) => ({
				input: { filter, value },
				output: false
			}))
		]

		testData.forEach(({ input: { filter, value }, output }) => {
			assert.equal(lotSizeIsValid(filter, value), output)
		})
	})
})

describe("minNotionalIsValid", () => {
	test("applies MIN_NOTIONAL symbol filter", () => {
		const filter: BinanceSymbolFilterMinNotional = {
			filterType: "MIN_NOTIONAL",
			minNotional: "0.00010000",
			applyToMarket: true,
			avgPriceMins: 5
		}

		const validValues = ["1", "0.1"]
		const invalidValues = ["0.00000000", "0.000001"]

		const testData: Array<{
			input: { filter: BinanceSymbolFilterMinNotional; value: string }
			output: boolean
		}> = [
			...validValues.map((value) => ({
				input: { filter, value },
				output: true
			})),
			...invalidValues.map((value) => ({
				input: { filter, value },
				output: false
			}))
		]

		testData.forEach(({ input: { filter, value }, output }) => {
			assert.equal(minNotionalIsValid(filter, value), output)
		})
	})
})
