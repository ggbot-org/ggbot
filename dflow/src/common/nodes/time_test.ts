import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { dayToTime } from 'minimal-time-helpers'

import {
	DflowCommonExecutor,
	getDflowExecutionOutputData,
} from '../executor.js'
import { coerceToTimeUnit } from './time.js'

test('coerceToTimeUnit', () => {
	type TestData = Array<{
		input: string
		output: ReturnType<typeof coerceToTimeUnit>
	}>
	const testData: TestData = [
		{ input: 'not a TimeUnit', output: undefined },
		{ input: 'seconds', output: 'second' },
		{ input: '1s', output: 'second' },
		{ input: 'minutes', output: 'minute' },
		{ input: '1m', output: 'minute' },
		{ input: 'hours', output: 'hour' },
		{ input: '1h', output: 'hour' },
		{ input: 'days', output: 'day' },
		{ input: '1d', output: 'day' },
	]

	for (const { input, output } of testData) {
		assert.equal(coerceToTimeUnit(input), output)
	}
})

describe('today', () => {
	test('reads context timestamp', async () => {
		const day = '1978-12-31'
		const nodeId = 'a'
		const executor = new DflowCommonExecutor({
			nodes: [{ id: nodeId, text: 'today' }],
			edges: [],
		})
		const { execution } = await executor.run({
			params: {},
			memory: {},
			time: dayToTime(day),
		})
		assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), day)
	})
})
