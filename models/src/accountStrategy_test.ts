import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { assertDeepEqual } from 'minimal-assertion-helpers'

import { accountStrategiesModifier } from './accountStrategies.js'
import { AccountStrategy } from './accountStrategy.js'
import { ErrorExceededQuota } from './errors.js'
import { newId } from './item.js'
import { StrategyScheduling } from './strategyScheduling.js'

const { insertAccountStrategy } = accountStrategiesModifier

type InsertAccountStrategy = typeof insertAccountStrategy
type InsertAccountStrategyInput = {
	previousAccountStrategies: Parameters<InsertAccountStrategy>[0]
	accountStrategy: Parameters<InsertAccountStrategy>[1]
	subscriptionPlan: Parameters<InsertAccountStrategy>[2]
}

const accountStrategy1: AccountStrategy = {
	strategyId: '11111111',
	strategyKind: 'binance',
	name: 'name 1',
	schedulings: []
}

const accountStrategy2: AccountStrategy = {
	strategyId: '22222222',
	strategyKind: 'binance',
	name: 'name 2',
	schedulings: []
}

const accountStrategy3: AccountStrategy = {
	strategyId: '33333333',
	strategyKind: 'binance',
	name: 'name 3',
	schedulings: []
}

const accountStrategy4Scheduling1: StrategyScheduling = {
	id: newId(),
	frequency: { every: 2, interval: '1h' },
	status: 'active'
}

const accountStrategy4Active: AccountStrategy = {
	strategyId: '44444444',
	strategyKind: 'binance',
	name: 'name 4',
	schedulings: [accountStrategy4Scheduling1]
}

const accountStrategy4Suspended: AccountStrategy = {
	...accountStrategy4Active,
	schedulings: [
		{
			...accountStrategy4Scheduling1,
			status: 'suspended'
		}
	]
}

describe('accountStrategiesModifier', () => {
	describe('insertAccountStrategy', () => {
		test('inserts a new item', () => {
			assertDeepEqual<
				InsertAccountStrategyInput,
				ReturnType<InsertAccountStrategy>
			>(
				({
					previousAccountStrategies,
					accountStrategy,
					subscriptionPlan
				}: InsertAccountStrategyInput) => insertAccountStrategy(
					previousAccountStrategies,
					accountStrategy,
					subscriptionPlan
				),
				[
					{
						input: {
							previousAccountStrategies: [],
							accountStrategy: accountStrategy1,
							subscriptionPlan: undefined
						},
						output: [accountStrategy1]
					}
				]
			)
		})

		test('throws ErrorExceededQuota with MAX_STRATEGIES_PER_ACCOUNT', () => {
			assert.throws(
				() => {
					insertAccountStrategy(
						[accountStrategy1, accountStrategy2],
						accountStrategy3,
						undefined
					)
				},
				{
					name: 'Error',
					message: ErrorExceededQuota.message(
						'MAX_STRATEGIES_PER_ACCOUNT'
					)
				}
			)
		})

		test('throws ErrorExceededQuota with MAX_SCHEDULINGS_PER_ACCOUNT', () => {
			assert.throws(
				() => {
					insertAccountStrategy([], accountStrategy4Active, undefined)
				},
				{
					name: 'Error',
					message: ErrorExceededQuota.message(
						'MAX_SCHEDULINGS_PER_ACCOUNT'
					)
				}
			)
		})
	})

	test('deleteAccountStrategy', () => {
		assertDeepEqual<
			Parameters<typeof accountStrategiesModifier.deleteAccountStrategy>,
			ReturnType<typeof accountStrategiesModifier.deleteAccountStrategy>
		>(
			function suspendScheduling(
				input: Parameters<
					typeof accountStrategiesModifier.deleteAccountStrategy
				>
			) {
				return accountStrategiesModifier.deleteAccountStrategy(...input)
			},
			[
				{
					input: [
						[accountStrategy1, accountStrategy4Active],
						accountStrategy4Active.strategyId
					],
					output: [accountStrategy1]
				}
			]
		)
	})

	test('suspendScheduling', () => {
		assertDeepEqual<
			Parameters<typeof accountStrategiesModifier.suspendScheduling>,
			ReturnType<typeof accountStrategiesModifier.suspendScheduling>
		>(
			function suspendScheduling(
				input: Parameters<
					typeof accountStrategiesModifier.suspendScheduling
				>
			) {
				return accountStrategiesModifier.suspendScheduling(...input)
			},
			[
				{
					input: [
						[accountStrategy1, accountStrategy4Active],
						accountStrategy4Active.strategyId,
						accountStrategy4Scheduling1.id
					],
					output: [accountStrategy1, accountStrategy4Suspended]
				}
			]
		)
	})

	test('suspendStrategySchedulings', () => {
		assertDeepEqual<
			Parameters<
				typeof accountStrategiesModifier.suspendStrategySchedulings
			>,
			ReturnType<
				typeof accountStrategiesModifier.suspendStrategySchedulings
			>
		>(
			function suspendStrategySchedulings(
				input: Parameters<
					typeof accountStrategiesModifier.suspendStrategySchedulings
				>
			) {
				return accountStrategiesModifier.suspendStrategySchedulings(
					...input
				)
			},
			[
				{
					input: [[accountStrategy1], accountStrategy1.strategyId],
					output: [accountStrategy1]
				},
				{
					input: [
						[accountStrategy1, accountStrategy4Active],
						accountStrategy4Active.strategyId
					],
					output: [accountStrategy1, accountStrategy4Suspended]
				}
			]
		)
	})

	test('updateSchedulingMemory', () => {
		assertDeepEqual<
			Parameters<typeof accountStrategiesModifier.updateSchedulingMemory>,
			ReturnType<typeof accountStrategiesModifier.updateSchedulingMemory>
		>(
			function updateSchedulingMemory(
				input: Parameters<
					typeof accountStrategiesModifier.updateSchedulingMemory
				>
			) {
				return accountStrategiesModifier.updateSchedulingMemory(
					...input
				)
			},
			[
				{
					input: [
						[accountStrategy4Active],
						accountStrategy4Active.strategyId,
						accountStrategy4Scheduling1.id,
						{ foo: 'bar' }
					],
					output: [
						{
							...accountStrategy4Active,
							schedulings: [
								{
									...accountStrategy4Scheduling1,
									memory: { foo: 'bar' }
								}
							]
						}
					]
				}
			]
		)
	})
})
