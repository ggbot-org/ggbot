import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { isStrategyFlowView, welcomeFlow } from './strategyFlow.js'
import { createdNow } from './time.js'

test('isStrategyFlowView', () => {
	for (const { input, output } of [
		{
			input: { whenUpdated: createdNow(), view: welcomeFlow },
			output: true,
		},
	]) {
		assert.equal(isStrategyFlowView(input), output)
	}
})
