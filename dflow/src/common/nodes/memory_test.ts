import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { SerializablePrimitive } from '@workspace/models'
import { now } from 'minimal-time-helpers'

import { DflowCommonExecutor, getDflowExecutionOutputData } from '../executor.js'

const testValues: SerializablePrimitive[] = [42, 'a string']

describe('deleteMemory', () => {
	test('can delete context memory', async () => {
		const nodeId = 'test'
		const key = 'memory key'
		for (const value of testValues) {
			const executor = new DflowCommonExecutor({
				nodes: [
					{
						id: 'key',
						text: JSON.stringify(key),
						outs: [{ id: 'out' }],
					},
					{
						id: nodeId,
						text: 'deleteMemory',
						ins: [{ id: 'key' }],
					},
				],
				edges: [{ id: 'e', from: ['key', 'out'], to: [nodeId, 'key'] }],
			})
			const { memory, memoryChanged } = await executor.run({ params: {}, memory: { [key]: value }, time: now() })
			assert.equal(memoryChanged, true)
			assert.equal(memory[key], undefined)
		}
	})
})

describe('getMemory', () => {
	test('can read context memory', async () => {
		const nodeId = 'test'
		const key = 'memory key'
		for (const value of testValues) {
			const executor = new DflowCommonExecutor({
				nodes: [
					{
						id: 'key',
						text: JSON.stringify(key),
						outs: [{ id: 'out' }],
					},
					{
						id: nodeId,
						text: 'getMemory',
						ins: [{ id: 'key' }, { id: 'default' }],
					},
				],
				edges: [{ id: 'e', from: ['key', 'out'], to: [nodeId, 'key'] }],
			})
			const { execution, memory, memoryChanged } = await executor.run({
				params: {},
				memory: { [key]: value },
				time: now(),
			})
			assert.equal(memoryChanged, false)
			assert.deepEqual(memory[key], value)
			assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
		}
	})

	test('can fallback to default', async () => {
		const nodeId = 'test'
		const key = 'memory key'
		for (const value of testValues) {
			const executor = new DflowCommonExecutor({
				nodes: [
					{
						id: 'key',
						text: JSON.stringify(key),
						outs: [{ id: 'out' }],
					},
					{
						id: 'default',
						text: JSON.stringify(value),
						outs: [{ id: 'out' }],
					},
					{
						id: nodeId,
						text: 'getMemory',
						ins: [{ id: 'key' }, { id: 'default' }],
					},
				],
				edges: [
					{ id: 'e1', from: ['key', 'out'], to: [nodeId, 'key'] },
					{
						id: 'e2',
						from: ['default', 'out'],
						to: [nodeId, 'default'],
					},
				],
			})
			const { execution, memory, memoryChanged } = await executor.run({ params: {}, memory: {}, time: now() })
			assert.equal(memoryChanged, false)
			assert.equal(memory[key], undefined)
			assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
		}
	})

	test('default value is ignored if memory is defined', async () => {
		const nodeId = 'test'
		const key = 'memory key'
		const defaultValue = 'my default value'
		for (const value of testValues) {
			const executor = new DflowCommonExecutor({
				nodes: [
					{
						id: 'key',
						text: JSON.stringify(key),
						outs: [{ id: 'out' }],
					},
					{
						id: 'default',
						text: JSON.stringify(defaultValue),
						outs: [{ id: 'out' }],
					},
					{
						id: nodeId,
						text: 'getMemory',
						ins: [{ id: 'key' }, { id: 'default' }],
					},
				],
				edges: [
					{ id: 'e1', from: ['key', 'out'], to: [nodeId, 'key'] },
					{
						id: 'e2',
						from: ['default', 'out'],
						to: [nodeId, 'default'],
					},
				],
			})
			const { execution, memory, memoryChanged } = await executor.run({
				params: {},
				memory: { [key]: value },
				time: now(),
			})
			assert.equal(memoryChanged, false)
			assert.equal(memory[key], value)
			assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value)
		}
	})
})

describe('setMemory', () => {
	test('can set context memory', async () => {
		const nodeId = 'test'
		const key = 'memory key'
		for (const value of testValues) {
			const executor = new DflowCommonExecutor({
				nodes: [
					{
						id: 'key',
						text: JSON.stringify(key),
						outs: [{ id: 'out' }],
					},
					{
						id: 'value',
						text: JSON.stringify(value),
						outs: [{ id: 'out' }],
					},
					{
						id: nodeId,
						text: 'setMemory',
						ins: [{ id: 'key' }, { id: 'value' }],
					},
				],
				edges: [
					{ id: 'e1', from: ['key', 'out'], to: [nodeId, 'key'] },
					{
						id: 'e2',
						from: ['value', 'out'],
						to: [nodeId, 'value'],
					},
				],
			})
			const { memory, memoryChanged } = await executor.run({ params: {}, memory: {}, time: now() })
			assert.equal(memoryChanged, true)
			assert.deepEqual(memory[key], value)
		}
	})
})
