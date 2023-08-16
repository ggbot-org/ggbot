import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import {
	getBalancesFromExecutionSteps,
	getOrdersFromExecutionSteps
} from "./execution.js"
import { BinanceClientMock } from "./mocks/client.js"
import { executionStepsBuyBTCUSD } from "./mocks/executionSteps.js"

describe("getBalancesFromExecutionSteps", () => {
	it("works", async () => {
		const binance = new BinanceClientMock()
		const { symbols } = await binance.exchangeInfo()
		;[
			{
				input: [],
				output: []
			},
			{
				input: executionStepsBuyBTCUSD,
				output: [
					{
						asset: "BTC",
						free: "0.00096",
						locked: "0.00000000"
					},
					{
						asset: "BUSD",
						free: "-19.88287",
						locked: "0.00000000"
					}
				]
			}
		].forEach(({ input, output }) => {
			assert.deepEqual(
				getBalancesFromExecutionSteps(symbols, input),
				output
			)
		})
	})
})

describe("getOrdersFromExecutionSteps", () => {
	it("works", () => {
		;[
			{
				input: [],
				output: []
			}
		].forEach(({ input, output }) => {
			assert.deepEqual(getOrdersFromExecutionSteps(input), output)
		})
	})
})
