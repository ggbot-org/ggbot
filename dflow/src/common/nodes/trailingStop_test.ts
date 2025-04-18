import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { StrategyFlowGraphEdge, StrategyFlowGraphNode } from '@workspace/models'
import { now } from 'minimal-time-helpers'

import { DflowCommonContext } from '../context.js'
import {
	DflowCommonExecutor,
	getDflowExecutionOutputData,
} from '../executor.js'
import {
	ComputeStopPriceArg,
	computeStopPriceDown,
	computeStopPriceUp,
	trailingStop,
	TrailingStopDown,
	TrailingStopInput,
	trailingStopMemoryKeys,
	TrailingStopOutput,
	TrailingStopUp,
} from './trailingStop.js'

type ExecuteTrailingStopInput = {
	enterTrailing: unknown
	resetTrailing?: unknown
	memoryLabel: string
	initialStopPrice?: number | undefined
} & Pick<TrailingStopInput, 'price' | 'percentageDelta'> &
	Pick<DflowCommonContext, 'memory'>
type ExecuteTrailingStopOutput = Partial<TrailingStopOutput> &
	Pick<DflowCommonContext, 'memory' | 'memoryChanged'>

type TrailingStopTestData = {
	input: ExecuteTrailingStopInput
	output: ExecuteTrailingStopOutput
}

const invalidPercentageDeltaValues = [0, 1]

const falsyValues = [false, 0, null, '']
const truthyValues = [true, 'ok', 1, { order: 'BTC' }]

const memoryLabel = 'test'

const exitTrailingAssertionError = 'check exitTrailing'
const memoryAssertionError = 'check memory'
const memoryChangedAssertionError = 'check memoryChanged'

async function executeTrailingStop(
	nodeKind: typeof TrailingStopUp.kind,
	{
		enterTrailing,
		memoryLabel,
		price,
		percentageDelta,
		initialStopPrice,
		resetTrailing,
		memory: memoryInput,
	}: ExecuteTrailingStopInput
): Promise<ExecuteTrailingStopOutput> {
	const nodeId = 'testId'
	const hasInitialStopPrice = typeof initialStopPrice === 'number'
	const hasResetTrailing = typeof resetTrailing !== 'undefined'

	const nodes: StrategyFlowGraphNode[] = [
		{
			id: 'enterTrailing',
			text: JSON.stringify(enterTrailing),
			outs: [{ id: 'o' }],
		},
		{
			id: 'memoryLabel',
			text: JSON.stringify(memoryLabel),
			outs: [{ id: 'o' }],
		},
		{
			id: 'price',
			text: JSON.stringify(price),
			outs: [{ id: 'o' }],
		},
		{
			id: 'percentageDelta',
			text: JSON.stringify(percentageDelta),
			outs: [{ id: 'o' }],
		},
		{
			id: nodeId,
			text: nodeKind,
			ins: [
				{ id: 'i1' },
				{ id: 'i2' },
				{ id: 'i3' },
				{ id: 'i4' },
				{ id: 'i5' },
				{ id: 'i6' },
			],
		},
	]

	if (hasInitialStopPrice)
		nodes.push({
			id: 'initialStopPrice',
			text: JSON.stringify(initialStopPrice),
			outs: [{ id: 'o' }],
		})
	if (hasResetTrailing)
		nodes.push({
			id: 'resetTrailing',
			text: JSON.stringify(resetTrailing),
			outs: [{ id: 'o' }],
		})

	const edges: StrategyFlowGraphEdge[] = [
		{
			id: 'e1',
			from: ['enterTrailing', 'o'],
			to: [nodeId, 'i1'],
		},
		{ id: 'e2', from: ['memoryLabel', 'o'], to: [nodeId, 'i2'] },
		{
			id: 'e3',
			from: ['price', 'o'],
			to: [nodeId, 'i3'],
		},
		{
			id: 'e4',
			from: ['percentageDelta', 'o'],
			to: [nodeId, 'i4'],
		},
	]

	if (hasInitialStopPrice)
		edges.push({
			id: 'e5',
			from: ['initialStopPrice', 'o'],
			to: [nodeId, 'i5'],
		})
	if (hasResetTrailing)
		edges.push({
			id: 'e6',
			from: ['resetTrailing', 'o'],
			to: [nodeId, 'i6'],
		})

	const executor = new DflowCommonExecutor({ nodes, edges })
	const {
		execution,
		memory: memoryOutput,
		memoryChanged,
	} = await executor.run({ params: {}, memory: memoryInput, time: now() })

	const exitTrailing = getDflowExecutionOutputData(execution, nodeId, 0)

	return {
		exitTrailing: typeof exitTrailing === 'boolean' ? exitTrailing : undefined,
		memory: memoryOutput,
		memoryChanged,
	}
}

test('TrailingStopUp', async () => {
	const { entryPriceMemoryKey, stopPriceMemoryKey } =
		trailingStopMemoryKeys(memoryLabel)

	const testData: TrailingStopTestData[] = [
		// If percentageDelta is not valid, algorithm does not run.
		...invalidPercentageDeltaValues.map((percentageDelta) => ({
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				percentageDelta,
				memory: {},
			},
			output: {
				exitTrailing: undefined,
				memory: {},
				memoryChanged: false,
			},
		})),

		// If `enterTrailing` is truthy, it gets initialized.
		...truthyValues.map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 100,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 99,
				},
				memoryChanged: true,
			},
		})),

		// If `initialStopPrice` is provided
		// and it is lower then `price`
		// then it is used instead of `percentageDelta`
		// to set `stopPriceMemoryKey`.
		{
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				initialStopPrice: 99.5,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 99.5,
				},
				memoryChanged: true,
			},
		},

		// If `initialStopPrice` is provided
		// and it is greater (or equal) then `price`
		// then it is ignored
		// and `percentageDelta` is used to set `stopPriceMemoryKey`.
		{
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				initialStopPrice: 100.5,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 99,
				},
				memoryChanged: true,
			},
		},

		// If `enterTrailing` is falsy, it does not get initialized.
		...falsyValues.map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 100,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: undefined,
				memory: {},
				memoryChanged: false,
			},
		})),

		// Regardless of `enterTrailing`,
		// `stopPrice` is read from memory as input and written as output.
		...[...falsyValues, ...truthyValues].map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 106,
				percentageDelta: 0.01,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 99,
				},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 104.94,
				},
				memoryChanged: true,
			},
		})),

		// Regardless of `enterTrailing`,
		// `stopPrice` does not change if `price` gets closer.
		...[...falsyValues, ...truthyValues].map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 105,
				percentageDelta: 0.01,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 104.94,
				},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 104.94,
				},
				memoryChanged: false,
			},
		})),

		// Regardless of `enterTrailing`,
		// if `price` goes beyond `stopPrice`
		// then `exitTrailing` is true and memory is cleaned up.
		...[...falsyValues, ...truthyValues].map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 104.8,
				percentageDelta: 0.01,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 104.94,
				},
			},
			output: {
				exitTrailing: true,
				memory: {},
				memoryChanged: true,
			},
		})),

		// If `resetTrailing` is truthy, it cleans up memory.
		...truthyValues.map((resetTrailing) => ({
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				// Invalid `percentageDelta` value, but `resetTrailing` has precedence.
				percentageDelta: invalidPercentageDeltaValues[0],
				initialStopPrice: 99.5,
				resetTrailing,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 99,
				},
			},
			output: {
				exitTrailing: undefined,
				memory: {},
				memoryChanged: true,
			},
		})),
	]

	for (const { input, output } of testData) {
		const { exitTrailing, memory, memoryChanged } = await executeTrailingStop(
			TrailingStopUp.kind,
			input
		)
		assert.equal(exitTrailing, output.exitTrailing, exitTrailingAssertionError)
		assert.equal(
			memoryChanged,
			output.memoryChanged,
			memoryChangedAssertionError
		)
		assert.deepEqual(memory, output.memory, memoryAssertionError)
	}
})

test('TrailingStopDown', async () => {
	const { entryPriceMemoryKey, stopPriceMemoryKey } =
		trailingStopMemoryKeys(memoryLabel)

	const testData: TrailingStopTestData[] = [
		// If percentageDelta is not valid, algorithm does not run.
		...invalidPercentageDeltaValues.map((percentageDelta) => ({
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				percentageDelta,
				memory: {},
			},
			output: {
				exitTrailing: undefined,
				memory: {},
				memoryChanged: false,
			},
		})),

		// If `enterTrailing` is truthy, it gets initialized.
		...truthyValues.map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 100,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 101,
				},
				memoryChanged: true,
			},
		})),

		// If `initialStopPrice` is provided
		// and it is greater then `price`
		// then it is used instead of `percentageDelta`
		// to set `stopPriceMemoryKey`.
		{
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				initialStopPrice: 100.5,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 100.5,
				},
				memoryChanged: true,
			},
		},

		// If `initialStopPrice` is provided
		// and it is lower (or equal) then `price`
		// then it is ignored
		// and `percentageDelta` is used to set `stopPriceMemoryKey`.
		{
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				initialStopPrice: 99.5,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 101,
				},
				memoryChanged: true,
			},
		},

		// If `enterTrailing` is falsy, it does not get initialized.
		...falsyValues.map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 100,
				percentageDelta: 0.01,
				memory: {},
			},
			output: {
				exitTrailing: undefined,
				memory: {},
				memoryChanged: false,
			},
		})),

		// Regardless of `enterTrailing`,
		// `stopPrice` is read from memory as input and written as output.
		...[...falsyValues, ...truthyValues].map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 94,
				percentageDelta: 0.01,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 99,
				},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 94.94,
				},
				memoryChanged: true,
			},
		})),

		// Regardless of `enterTrailing`,
		// `stopPrice` does not change if `price` gets closer.
		...[...falsyValues, ...truthyValues].map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 94.9,
				percentageDelta: 0.01,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 94.94,
				},
			},
			output: {
				exitTrailing: false,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 94.94,
				},
				memoryChanged: false,
			},
		})),

		// Regardless of `enterTrailing`,
		// if `price` goes beyond `stopPrice`
		// then `exitTrailing` is true and memory is cleaned up.
		...[...falsyValues, ...truthyValues].map((enterTrailing) => ({
			input: {
				enterTrailing,
				memoryLabel,
				price: 94.98,
				percentageDelta: 0.01,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 94.94,
				},
			},
			output: {
				exitTrailing: true,
				memory: {},
				memoryChanged: true,
			},
		})),

		// If `resetTrailing` is truthy, it cleans up memory.
		...truthyValues.map((resetTrailing) => ({
			input: {
				enterTrailing: true,
				memoryLabel,
				price: 100,
				// Invalid `percentageDelta` value, but `resetTrailing` has precedence.
				percentageDelta: invalidPercentageDeltaValues[0],
				initialStopPrice: 100.5,
				resetTrailing,
				memory: {
					[entryPriceMemoryKey]: 100,
					[stopPriceMemoryKey]: 101,
				},
			},
			output: {
				exitTrailing: undefined,
				memory: {},
				memoryChanged: true,
			},
		})),
	]

	for (const { input, output } of testData) {
		const { exitTrailing, memory, memoryChanged } = await executeTrailingStop(
			TrailingStopDown.kind,
			input
		)
		assert.equal(exitTrailing, output.exitTrailing, exitTrailingAssertionError)
		assert.equal(
			memoryChanged,
			output.memoryChanged,
			memoryChangedAssertionError
		)
		assert.deepEqual(memory, output.memory, memoryAssertionError)
	}
})

test('trailingStop', () => {
	type TestData = Array<{
		input: TrailingStopInput
		output: TrailingStopOutput
	}>
	const testData: TestData = [
		// If `direction` is "UP" and `price` is below `stopPrice`, then `exitTrailing` is true.
		{
			input: {
				direction: 'UP',
				price: 99,
				percentageDelta: 0,
				stopPrice: 100,
			},
			output: { exitTrailing: true, stopPrice: 100 },
		},
		// If `direction` is "DOWN" and `price` is above `stopPrice`, then `exitTrailing` is true.
		{
			input: {
				direction: 'DOWN',
				price: 101,
				percentageDelta: 0,
				stopPrice: 100,
			},
			output: { exitTrailing: true, stopPrice: 100 },
		},
		// Return adjusted `stopPrice` according to `percentageDelta`.
		{
			input: {
				direction: 'UP',
				price: 100,
				percentageDelta: 0.01,
				stopPrice: 50,
			},
			output: { exitTrailing: false, stopPrice: 99 },
		},
		{
			input: {
				direction: 'DOWN',
				price: 100,
				percentageDelta: 0.01,
				stopPrice: 150,
			},
			output: { exitTrailing: false, stopPrice: 101 },
		},
		// Leave `stopPrice` as is when `price` gets closer.
		{
			input: {
				direction: 'UP',
				price: 100,
				percentageDelta: 0.02,
				stopPrice: 99,
			},
			output: { exitTrailing: false, stopPrice: 99 },
		},
		{
			input: {
				direction: 'DOWN',
				price: 100,
				percentageDelta: 0.02,
				stopPrice: 101,
			},
			output: { exitTrailing: false, stopPrice: 101 },
		},
	]

	for (const { input, output } of testData) {
		assert.deepEqual(trailingStop(input), output)
	}
})

test('computeStopPriceDown', () => {
	type TestData = Array<{
		input: ComputeStopPriceArg
		output: number
	}>
	const testData: TestData = [
		{
			input: { price: 12345.6789, percentageDelta: 0.01 },
			output: 12469.135689,
		},
	]

	for (const { input, output } of testData) {
		assert.equal(computeStopPriceDown(input), output)
	}
})

test('computeStopPriceUp', () => {
	type TestData = Array<{
		input: ComputeStopPriceArg
		output: number
	}>
	const testData: TestData = [
		{
			input: { price: 12345.6789, percentageDelta: 0.01 },
			output: 12222.222111,
		},
	]

	for (const { input, output } of testData) {
		assert.equal(computeStopPriceUp(input), output)
	}
})
