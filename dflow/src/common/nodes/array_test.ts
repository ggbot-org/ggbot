import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { now } from 'minimal-time-helpers'

import { DflowCommonExecutor, getDflowExecutionOutputData } from '../executor.js'

test('shift', async () => {
	const nodeId = 'operator'
	const executor = new DflowCommonExecutor({
		nodes: [
			{
				id: 'array',
				text: '[1,2,3]',
				outs: [{ id: 'out' }],
			},
			{
				id: nodeId,
				text: 'shift',
				ins: [{ id: 'in' }],
			},
		],
		edges: [{ id: 'e1', from: ['array', 'out'], to: [nodeId, 'in'] }],
	})
	const { execution } = await executor.run({ params: {}, memory: {}, time: now() })
	assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 1)
	assert.deepEqual(getDflowExecutionOutputData(execution, nodeId, 1), [2, 3])
})

test('pop', async () => {
	const nodeId = 'operator'
	const executor = new DflowCommonExecutor({
		nodes: [
			{
				id: 'array',
				text: '[1,2,3]',
				outs: [{ id: 'out' }],
			},
			{
				id: nodeId,
				text: 'pop',
				ins: [{ id: 'in' }],
			},
		],
		edges: [{ id: 'e1', from: ['array', 'out'], to: [nodeId, 'in'] }],
	})
	const { execution } = await executor.run({ params: {}, memory: {}, time: now() })
	assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 3)
	assert.deepEqual(getDflowExecutionOutputData(execution, nodeId, 1), [1, 2])
})

test('push', async () => {
	const nodeId = 'operator'
	const executor = new DflowCommonExecutor({
		nodes: [
			{
				id: 'array',
				text: '[1,2,3]',
				outs: [{ id: 'out1' }],
			},
			{
				id: 'element',
				text: '{ "foo": true }',
				outs: [{ id: 'out2' }],
			},
			{
				id: nodeId,
				text: 'push',
				ins: [{ id: 'in1' }, { id: 'in2' }],
			},
		],
		edges: [
			{ id: 'e1', from: ['array', 'out1'], to: [nodeId, 'in1'] },
			{
				id: 'e2',
				from: ['element', 'out2'],
				to: [nodeId, 'in2'],
			},
		],
	})
	const { execution } = await executor.run({ params: {}, memory: {}, time: now() })
	assert.deepEqual(getDflowExecutionOutputData(execution, nodeId, 0), [1, 2, 3, { foo: true }])
})
