import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { quota } from './quotas.js'

type Plan = 'basic' | 'pro' | null | undefined

describe('quota', () => {
	test('MAX_SCHEDULINGS_PER_ACCOUNT', () => {
		type TestData = Array<{
			input: Plan;
			output: number;
		}>
		const testData: TestData = [
			{ input: undefined, output: 0 },
			{ input: 'basic', output: 10 },
			{ input: 'pro', output: 30 },
		]

		for (const { input, output } of testData) {
			assert.equal(quota.MAX_SCHEDULINGS_PER_ACCOUNT(input), output)
		}
	})

	test('MAX_STRATEGIES_PER_ACCOUNT', () => {
		type TestData = Array<{
			input: Plan;
			output: number;
		}>
		const testData: TestData = [
			{ input: undefined, output: 2 },
			{ input: 'basic', output: 20 },
			{ input: 'pro', output: 50 },
		]

		for (const { input, output } of testData) {
			assert.equal(quota.MAX_STRATEGIES_PER_ACCOUNT(input), output)
		}
	})
})
