import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { nullStrategyKey } from '@workspace/models'

import { BacktestingStrategy } from './strategy.js'

export const emptyStrategy = () => new BacktestingStrategy({
	flow: { nodes: [], edges: [] },
	strategyKey: nullStrategyKey,
	strategyName: 'empty strategy'
})

describe('BacktestingStrategy', () => {
	test('constructor', () => {
		assert.ok(emptyStrategy() instanceof BacktestingStrategy)
	})
})
