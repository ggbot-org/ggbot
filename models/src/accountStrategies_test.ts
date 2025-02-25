import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { accountStrategiesModifier } from './accountStrategies.js'
import { AccountStrategy } from './accountStrategy.js'
import { ErrorExceededQuota } from './errors.js'
import { newId } from './item.js'
import { StrategyScheduling } from './strategyScheduling.js'

const accountStrategy1: AccountStrategy = {
	strategyId: '11111111',
	strategyKind: 'binance',
	name: 'name 1',
	schedulings: [],
}

const accountStrategy2: AccountStrategy = {
	strategyId: '22222222',
	strategyKind: 'binance',
	name: 'name 2',
	schedulings: [],
}

const accountStrategy3: AccountStrategy = {
	strategyId: '33333333',
	strategyKind: 'binance',
	name: 'name 3',
	schedulings: [],
}

const accountStrategy4Scheduling1: StrategyScheduling = {
	id: newId(),
	frequency: { every: 2, interval: '1h' },
	status: 'active',
}

const accountStrategy4Active: AccountStrategy = {
	strategyId: '44444444',
	strategyKind: 'binance',
	name: 'name 4',
	schedulings: [accountStrategy4Scheduling1],
}

const accountStrategy4Suspended: AccountStrategy = {
	...accountStrategy4Active,
	schedulings: [
		{
			...accountStrategy4Scheduling1,
			status: 'suspended',
		},
	],
}

describe('accountStrategiesModifier', () => {
	describe('insertAccountStrategy', () => {
		test('inserts a new item', () => {
			type TestData = Array<{
				input: Parameters<
					typeof accountStrategiesModifier.insertAccountStrategy
				>
				output: ReturnType<
					typeof accountStrategiesModifier.insertAccountStrategy
				>
			}>
			const testData: TestData = [
				{
					input: [[], accountStrategy1, undefined],
					output: [accountStrategy1],
				},
			]

			for (const { input, output } of testData) {
				assert.deepEqual(
					accountStrategiesModifier.insertAccountStrategy(...input),
					output
				)
			}
		})

		test('throws ErrorExceededQuota with MAX_STRATEGIES_PER_ACCOUNT', () => {
			assert.throws(
				() => {
					accountStrategiesModifier.insertAccountStrategy(
						[accountStrategy1, accountStrategy2],
						accountStrategy3,
						undefined
					)
				},
				{
					name: 'Error',
					message: ErrorExceededQuota.message('MAX_STRATEGIES_PER_ACCOUNT'),
				}
			)
		})

		test('throws ErrorExceededQuota with MAX_SCHEDULINGS_PER_ACCOUNT', () => {
			assert.throws(
				() => {
					accountStrategiesModifier.insertAccountStrategy(
						[],
						accountStrategy4Active,
						undefined
					)
				},
				{
					name: 'Error',
					message: ErrorExceededQuota.message('MAX_SCHEDULINGS_PER_ACCOUNT'),
				}
			)
		})
	})

	test('deleteAccountStrategy', () => {
		type TestData = Array<{
			input: Parameters<typeof accountStrategiesModifier.deleteAccountStrategy>
			output: ReturnType<typeof accountStrategiesModifier.deleteAccountStrategy>
		}>
		const testData: TestData = [
			{
				input: [
					[accountStrategy1, accountStrategy4Active],
					accountStrategy4Active.strategyId,
				],
				output: [accountStrategy1],
			},
		]

		for (const { input, output } of testData) {
			assert.deepEqual(
				accountStrategiesModifier.deleteAccountStrategy(...input),
				output
			)
		}
	})

	test('suspendScheduling', () => {
		type TestData = Array<{
			input: Parameters<typeof accountStrategiesModifier.suspendScheduling>
			output: ReturnType<typeof accountStrategiesModifier.suspendScheduling>
		}>
		const testData: TestData = [
			{
				input: [
					[accountStrategy1, accountStrategy4Active],
					accountStrategy4Active.strategyId,
					accountStrategy4Scheduling1.id,
				],
				output: [accountStrategy1, accountStrategy4Suspended],
			},
		]

		for (const { input, output } of testData) {
			assert.deepEqual(
				accountStrategiesModifier.suspendScheduling(...input),
				output
			)
		}
	})

	test('suspendStrategySchedulings', () => {
		type TestData = Array<{
			input: Parameters<
				typeof accountStrategiesModifier.suspendStrategySchedulings
			>
			output: ReturnType<
				typeof accountStrategiesModifier.suspendStrategySchedulings
			>
		}>
		const testData: TestData = [
			{
				input: [[accountStrategy1], accountStrategy1.strategyId],
				output: [accountStrategy1],
			},
			{
				input: [
					[accountStrategy1, accountStrategy4Active],
					accountStrategy4Active.strategyId,
				],
				output: [accountStrategy1, accountStrategy4Suspended],
			},
		]

		for (const { input, output } of testData) {
			assert.deepEqual(
				accountStrategiesModifier.suspendStrategySchedulings(...input),
				output
			)
		}
	})

	test('updateSchedulingMemory', () => {
		type TestData = Array<{
			input: Parameters<typeof accountStrategiesModifier.updateSchedulingMemory>
			output: ReturnType<
				typeof accountStrategiesModifier.updateSchedulingMemory
			>
		}>
		const testData: TestData = [
			{
				input: [
					[accountStrategy4Active],
					accountStrategy4Active.strategyId,
					accountStrategy4Scheduling1.id,
					{ foo: 'bar' },
				],
				output: [
					{
						...accountStrategy4Active,
						schedulings: [
							{
								...accountStrategy4Scheduling1,
								memory: { foo: 'bar' },
							},
						],
					},
				],
			},
		]

		for (const { input, output } of testData) {
			assert.deepEqual(
				accountStrategiesModifier.updateSchedulingMemory(...input),
				output
			)
		}
	})
})
