import { describe, test } from "node:test"

import { MaybeObject } from "minimal-type-guard-helpers"

import { assertEqual } from "./assertions.js"
import { normalizeName } from "./name.js"
import { invalidNames } from "./name_test.js"
import { isStrategy, newStrategy, Strategy } from "./strategy.js"
import { createdNow } from "./time.js"

describe("isStrategy", () => {
	test("validates Strategy", () => {
		const accountId = "00000000"
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
					id: "not an id",
					kind,
					name,
					whenCreated
				},
				output: false
			},
			{
				input: {
					accountId,
					id: "00000000",
					whenCreated: "not a timestamp"
				},
				output: false
			},
			...invalidNames.map((invalidName) => ({
				input: {
					accountId,
					id: "00000000",
					kind,
					name: normalizeName(invalidName),
					whenCreated
				},
				output: false
			}))
		])
	})
})
