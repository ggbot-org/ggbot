import { test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import { getBalanceFromExecutionSteps } from "./execution.js"
import { DflowBinanceClientMock } from "./mocks/client.js"
import { executionStepsBuyBTCUSD } from "./mocks/executionSteps.js"

void test("getBalanceFromExecutionSteps", async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()

	type Input = Parameters<typeof getBalanceFromExecutionSteps>[1]

	assertDeepEqual<Input, ReturnType<typeof getBalanceFromExecutionSteps>>(
		(input: Input) => getBalanceFromExecutionSteps(symbols, input),
		[
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
		]
	)
})
