import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { extractCommonParametersFromFlow } from './flow.js'
import { BooleanParameter, NumberParameter, PercentageParameter, StringParameter } from './nodes/parameters.js'
import { parsePercentage } from './nodeTextParser.js'

test('extractCommonParametersFromFlow', async () => {
	const booleanValue = false
	const booleanKey = 'my boolean'
	const numberValue = 1.2
	const numberKey = 'my number'
	const percValue = '10%'
	const percKey = 'my perc'
	const stringValue = 'string'
	const stringKey = 'my string'

	assert.deepEqual(
		await extractCommonParametersFromFlow({
			nodes: [
				{
					id: 'n1',
					text: JSON.stringify(booleanKey),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n2',
					text: JSON.stringify(booleanValue),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n3',
					text: BooleanParameter.kind,
					ins: [{ id: 'i1' }, { id: 'i2' }],
					outs: [{ id: 'o1' }],
				},
			],
			edges: [
				{ id: 'e1', from: ['n1', 'o1'], to: ['n3', 'i1'] },
				{ id: 'e2', from: ['n2', 'o1'], to: ['n3', 'i2'] },
			],
		}),
		[
			{
				kind: BooleanParameter.kind,
				key: booleanKey,
				defaultValue: booleanValue,
			},
		],
	)

	assert.deepEqual(
		await extractCommonParametersFromFlow({
			nodes: [
				{
					id: 'n1',
					text: JSON.stringify(numberKey),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n2',
					text: JSON.stringify(numberValue),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n3',
					text: NumberParameter.kind,
					ins: [{ id: 'i1' }, { id: 'i2' }],
					outs: [{ id: 'o1' }],
				},
			],
			edges: [
				{ id: 'e1', from: ['n1', 'o1'], to: ['n3', 'i1'] },
				{ id: 'e2', from: ['n2', 'o1'], to: ['n3', 'i2'] },
			],
		}),
		[
			{
				kind: NumberParameter.kind,
				key: numberKey,
				defaultValue: numberValue,
			},
		],
	)

	assert.deepEqual(
		await extractCommonParametersFromFlow({
			nodes: [
				{
					id: 'n1',
					text: JSON.stringify(percKey),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n2',
					text: percValue,
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n3',
					text: PercentageParameter.kind,
					ins: [{ id: 'i1' }, { id: 'i2' }],
					outs: [{ id: 'o1' }],
				},
			],
			edges: [
				{ id: 'e1', from: ['n1', 'o1'], to: ['n3', 'i1'] },
				{ id: 'e2', from: ['n2', 'o1'], to: ['n3', 'i2'] },
			],
		}),
		[
			{
				kind: PercentageParameter.kind,
				key: percKey,
				defaultValue: parsePercentage(percValue),
			},
		],
	)

	assert.deepEqual(
		await extractCommonParametersFromFlow({
			nodes: [
				{
					id: 'n1',
					text: JSON.stringify(stringKey),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n2',
					text: JSON.stringify(stringValue),
					outs: [{ id: 'o1' }],
				},
				{
					id: 'n3',
					text: StringParameter.kind,
					ins: [{ id: 'i1' }, { id: 'i2' }],
					outs: [{ id: 'o1' }],
				},
			],
			edges: [
				{ id: 'e1', from: ['n1', 'o1'], to: ['n3', 'i1'] },
				{ id: 'e2', from: ['n2', 'o1'], to: ['n3', 'i2'] },
			],
		}),
		[
			{
				kind: StringParameter.kind,
				key: stringKey,
				defaultValue: stringValue,
			},
		],
	)
})
