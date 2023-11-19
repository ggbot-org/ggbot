import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { nullId } from "./item.js"
import { invalidId } from "./item_test.js"
import { normalizeName } from "./name.js"
import { invalidNames } from "./name_test.js"
import {
	isCreateStrategyInput,
	isStrategy,
	newStrategy,
	Strategy
} from "./strategy.js"
import { createdNow } from "./time.js"

describe("isCreateStrategyInput", () => {
	test("validates CreateStrategyInput", () => {
		const accountId = nullId
		const kind = "binance"
		const name = "Name"
		assertEqual<Partial<MaybeObject<Strategy>>, boolean>(
			isCreateStrategyInput,
			[
				{
					input: { accountId, kind, name },
					output: true
				},
				{
					input: {
						accountId: invalidId,
						kind,
						name
					},
					output: false
				},
				...invalidNames.map((invalidName) => ({
					input: {
						accountId,
						kind,
						name: normalizeName(invalidName)
					},
					output: false
				}))
			]
		)
	})
})

describe("isStrategy", () => {
	test("validates Strategy", () => {
		const accountId = nullId
		const kind = "binance"
		const name = "Name"
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
					whenCreated: "not a timestamp"
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
})
