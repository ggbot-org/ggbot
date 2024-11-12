import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { now } from 'minimal-time-helpers'

import { DflowCommonExecutor, getDflowExecutionOutputData } from './executor.js'
import { parsePercentage } from './nodeTextParser.js'

test('perc nodes', async () => {
	const nodeId = 'operator'
	const num = 42
	const percentageStr = '1%'
	const percentageNum = parsePercentage(percentageStr)
	if (percentageNum === undefined) throw new TypeError()
	const executor = new DflowCommonExecutor({
		nodes: [
			{
				id: 'i1',
				text: JSON.stringify(num),
				outs: [{ id: 'o1' }]
			},
			{
				id: 'i2',
				text: percentageStr,
				outs: [{ id: 'o2' }]
			},
			{
				id: nodeId,
				text: 'mul',
				ins: [{ id: 'a' }, { id: 'b' }]
			}
		],
		edges: [
			{ id: 'e1', from: ['i1', 'o1'], to: [nodeId, 'a'] },
			{ id: 'e2', from: ['i2', 'o2'], to: [nodeId, 'b'] }
		]
	})
	const { execution } = await executor.run({
		params: {},
		memory: {},
		time: now()
	})
	const result = getDflowExecutionOutputData(execution, nodeId, 0)
	assert.equal(result, num * percentageNum)
})
