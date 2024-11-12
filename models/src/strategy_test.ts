import { test } from 'node:test'

import { assertEqual } from 'minimal-assertion-helpers'
import { MaybeObject } from 'minimal-type-guard-helpers'

import { nullId } from './item.js'
import { invalidId } from './item_test.js'
import { normalizeName } from './name.js'
import { invalidNames } from './name_test.js'
import { isStrategy, newStrategy, Strategy } from './strategy.js'
import { createdNow } from './time.js'

test('isStrategy', () => {
	const accountId = nullId
	const kind = 'none'
	const name = 'Name'
	const { whenCreated } = createdNow()
	assertEqual<Partial<MaybeObject<Strategy>>, boolean>(isStrategy, [
		{
			input: newStrategy({ accountId, kind, name }),
			output: true
		},
		{
			input: {
				accountId,
				id: invalidId,
				kind,
				name,
				whenCreated
			},
			output: false
		},
		{
			input: {
				accountId,
				id: nullId,
				whenCreated: 'not a timestamp'
			},
			output: false
		},
		...invalidNames.map((invalidName) => ({
			input: {
				accountId,
				id: nullId,
				kind,
				name: normalizeName(invalidName),
				whenCreated
			},
			output: false
		}))
	])
})
