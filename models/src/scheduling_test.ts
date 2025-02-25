import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import {
	getSchedulingSummary,
	Scheduling,
	schedulingsAreInactive,
	SchedulingSummary,
} from './scheduling.js'

describe('getSchedulingSummary', () => {
	test('return a SchedulingSummary', () => {
		type TestData = Array<{
			input: Scheduling[]
			output: SchedulingSummary
		}>
		const testData: TestData = [
			{
				input: [],
				output: {
					active: 0,
					inactive: 0,
					suspended: 0,
				},
			},
			{
				input: [
					{
						status: 'inactive',
						frequency: { every: 1, interval: '1h' },
					},
				],
				output: {
					active: 0,
					inactive: 1,
					suspended: 0,
				},
			},
			{
				input: [
					{
						status: 'inactive',
						frequency: { every: 2, interval: '1h' },
					},
					{
						status: 'active',
						frequency: { every: 3, interval: '1h' },
					},
				],
				output: {
					active: 1,
					inactive: 1,
					suspended: 0,
				},
			},
			{
				input: [
					{
						status: 'inactive',
						frequency: { every: 2, interval: '1h' },
					},
					{
						status: 'inactive',
						frequency: { every: 3, interval: '1h' },
					},
					{
						status: 'suspended',
						frequency: { every: 3, interval: '1h' },
					},
				],
				output: {
					active: 0,
					inactive: 2,
					suspended: 1,
				},
			},
		]

		for (const { input, output } of testData) {
			assert.deepEqual(getSchedulingSummary(input), output)
		}
	})
})

describe('schedulingsAreInactive', () => {
	test('checks if schedulings are inactive overall', () => {
		type TestData = Array<{
			input: Scheduling[]
			output: boolean
		}>
		const testData: TestData = [
			{
				input: [],
				output: true,
			},
			{
				input: [
					{
						status: 'inactive',
						frequency: { every: 1, interval: '1h' },
					},
				],
				output: true,
			},
			{
				input: [
					{
						status: 'inactive',
						frequency: { every: 2, interval: '1h' },
					},
					{
						status: 'active',
						frequency: { every: 3, interval: '1h' },
					},
				],
				output: false,
			},
			{
				input: [
					{
						status: 'inactive',
						frequency: { every: 2, interval: '1h' },
					},
					{
						status: 'inactive',
						frequency: { every: 3, interval: '1h' },
					},
				],
				output: true,
			},
		]

		for (const { input, output } of testData) {
			assert.equal(schedulingsAreInactive(input), output)
		}
	})
})
