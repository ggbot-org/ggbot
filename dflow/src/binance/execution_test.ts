import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { getBalanceFromExecutionSteps } from './execution.js'
import { DflowBinanceClientMock } from './mocks/client.js'
import { executionStepsBuyBTCUSD } from './mocks/executionSteps.js'

test('getBalanceFromExecutionSteps', async () => {
	const binance = new DflowBinanceClientMock()
	const { symbols } = await binance.exchangeInfo()

	type TestData = Array<{
		input: Parameters<typeof getBalanceFromExecutionSteps>[1]
		output: ReturnType<typeof getBalanceFromExecutionSteps>
	}>
	const testData: TestData = [
		{
			input: [],
			output: []
		},
		{
			input: executionStepsBuyBTCUSD,
			output: [
				{
					asset: 'BTC',
					free: '0.00096',
					locked: '0.00000000'
				},
				{
					asset: 'BUSD',
					free: '-19.88287',
					locked: '0.00000000'
				}
			]
		}
	]

	for (const { input, output } of testData) {
		assert.deepEqual(getBalanceFromExecutionSteps(symbols, input), output)
	}
})
