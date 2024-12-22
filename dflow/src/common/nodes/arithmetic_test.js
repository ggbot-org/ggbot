import {strict as assert} from 'node:assert'
import {test} from 'node:test'

import {Dflow} from 'dflow'
import {now} from 'minimal-time-helpers'

import {DflowCommonExecutor, getDflowExecutionOutputData} from '../executor.js'

test('add', async () => {
	const operator = 'add'
	const testData = [
		{input: {a: 2, b: 3}, output: 5},
		{input: {a: 0.2, b: 0.1}, output: 0.3},
	]
	for (const {input, output} of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

test('sub', async () => {
	const operator = 'sub'
	const testData = [
		{input: {a: 2, b: 3}, output: -1},
	]
	for (const {input, output} of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

test('mul', async () => {
	const operator = 'mul'
	const testData = [
		{input: {a: 2, b: 3}, output: 6},
	]
	for (const {input, output} of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

test('div', async () => {
	const operator = 'div'
	const testData = [
		{input: {a: 3, b: 2}, output: 1.5},
		// Division by zero
		{input: {a: 1, b: 0}, output: undefined},
	]
	for (const {input, output} of testData) {
		const result = await executeOperator(operator, input)
		assert.equal(result, output)
	}
})

/**
 * @param {string} nodeKind
 * @param {{ a: number, b: number }} input
 */
async function executeOperator(nodeKind, {a, b}) {
	const nodeId = 'operator'
	const executor = new DflowCommonExecutor({
		nodes: [
			{
				id: 'i1',
				text: JSON.stringify(a),
				outs: [{id: 'o1'}]
			},
			{
				id: 'i2',
				text: JSON.stringify(b),
				outs: [{id: 'o2'}]
			},
			{
				id: nodeId,
				text: nodeKind,
				ins: [{id: 'a'}, {id: 'b'}]
			}
		],
		edges: [
			{id: 'e1', from: ['i1', 'o1'], to: [nodeId, 'a']},
			{id: 'e2', from: ['i2', 'o2'], to: [nodeId, 'b']}
		]
	})
	const {execution} = await executor.run({
		params: {},
		memory: {},
		time: now()
	})
	const result = getDflowExecutionOutputData(execution, nodeId, 0)
	if (result === undefined || Dflow.isNumber(result)) return result
	throw new TypeError()
}
