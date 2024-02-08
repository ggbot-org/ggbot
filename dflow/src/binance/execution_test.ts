import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import {
	getBalancesFromExecutionSteps,
	getOrdersFromExecutionSteps
} from "./execution.js"
import { DflowBinanceClientMock } from "./mocks/client.js"
import { executionStepsBuyBTCUSD } from "./mocks/executionSteps.js"

void describe("getBalancesFromExecutionSteps", () => {
	void test("works", async () => {
		const binance = new DflowBinanceClientMock()
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

void describe("getOrdersFromExecutionSteps", () => {
	void test("works", () => {
		[
			{
				input: [],
				output: []
			}
		].forEach(({ input, output }) => {
			assert.deepEqual(getOrdersFromExecutionSteps(input), output)
		})
	})
})
