import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { MaybeObject } from 'minimal-type-guard-helpers'

import { nullId } from './item.js'
import { invalidId } from './item_test.js'
import { normalizeName } from './name.js'
import { invalidNames } from './name_test.js'
import { isStrategy, newStrategy, Strategy } from './strategy.js'
import { createdNow } from './time.js'

test('isStrategy', () => {
	type TestData = Array<{
		input: Partial<MaybeObject<Strategy>>
		output: boolean
	}>

	const accountId = nullId
	const kind = 'none'
	const name = 'Name'
	const { whenCreated } = createdNow()

	const testData: TestData = [
		{
			input: newStrategy({ accountId, kind, name }),
			output: true,
		},
		{
			input: {
				accountId,
				id: invalidId,
				kind,
				name,
				whenCreated,
			},
			output: false,
		},
		{
			input: {
				accountId,
				id: nullId,
				whenCreated: 'not a timestamp',
			},
			output: false,
		},
		...invalidNames.map((invalidName) => ({
			input: {
				accountId,
				id: nullId,
				kind,
				name: normalizeName(invalidName),
				whenCreated,
			},
			output: false,
		})),
	]

	for (const { input, output } of testData) {
		assert.equal(isStrategy(input), output)
	}
})
