import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import {
	generateOneTimePassword,
	isOneTimePassword,
	OneTimePassword
} from "./oneTimePassword.js"
import { createdNow } from "./time.js"

describe("isOneTimePassword", () => {
	test("validates input if is valid OneTimePassword", () => {
		assertEqual<MaybeObject<OneTimePassword>, boolean>(isOneTimePassword, [
			{
				input: { code: "123456", ...createdNow() },
				output: true
			}
		])
	})
})

describe("generateOneTimePassword", () => {
	test("generates a OneTimePassword", () => {
		assert.ok(isOneTimePassword(generateOneTimePassword()))
	})
})
