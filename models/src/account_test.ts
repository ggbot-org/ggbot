import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { Account, isAccount, newAccount } from "./account.js"
import { nullId } from "./item.js"
import { normalizeName } from "./name.js"
import { invalidNames } from "./name_test.js"
import { createdNow } from "./time.js"

void test("isAccount", () => {
	const email = "user@example.com"
	const { whenCreated } = createdNow()
	assertEqual<MaybeObject<Account>, boolean>(isAccount, [
		{
			input: newAccount({ email }),
			output: true
		},
		{
			input: newAccount({ email, name: "Name" }),
			output: true
		},
		{
			input: { id: "not an id", email, whenCreated },
			output: false
		},
		{
			input: { id: nullId, email: "not an email", whenCreated },
			output: false
		},
		{
			input: {
				id: nullId,
				email,
				whenCreated: "not a timestamp"
			},
			output: false
		},
		...invalidNames.map((invalidName) => ({
			input: {
				id: nullId,
				email,
				whenCreated,
				name: normalizeName(invalidName)
			},
			output: false
		}))
	])
})
