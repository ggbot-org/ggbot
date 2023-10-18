import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { EmailAddress, isEmailAddress, normalizeEmailAddress } from "./email.js"
import { ErrorInvalidArg } from "./errors.js"

describe("normalizeEmailAddress", () => {
	test("returns email in lowercase", () => {
		assertEqual<EmailAddress, EmailAddress>(normalizeEmailAddress, [
			{ input: "lower@example.com", output: "lower@example.com" },
			{ input: "MiXeD@example.com", output: "mixed@example.com" }
		])
	})

	test("removes period characters", () => {
		[
			{ input: "john.smith@gmail.com", output: "johnsmith@gmail.com" },
			{ input: "jOhN.sMiTh@gmail.com", output: "johnsmith@gmail.com" },
			{
				input: "MiXeD.cAsE@example.com",
				output: "mixedcase@example.com"
			},
			{ input: "u.s.e.r@example.com", output: "user@example.com" }
		].forEach(({ input, output }) => {
			if (!isEmailAddress(input)) throw new Error()
			assert.equal(normalizeEmailAddress(input), output)
		})
	})

	test("removes labels", () => {
		[
			{ input: "user+label@example.com", output: "user@example.com" }
		].forEach(({ input, output }) => {
			if (!isEmailAddress(input)) throw new Error()
			assert.equal(normalizeEmailAddress(input), output)
		})
	})

	test("throws ErrorInvalidArg", () => {
		["", "@@", "not an email", "john.smith at gmail.com"].forEach(
			(value) => {
				assert.throws(
					() => {
						normalizeEmailAddress(value)
					},
					{
						name: "Error",
						message: ErrorInvalidArg.message("EmailAddress")
					}
				)
			}
		)
	})
})

describe("isEmailAddress", () => {
	test("validates email", () => {
		[
			{ input: undefined, output: false },
			{ input: "not an email", output: false },
			{ input: "john.smith at gmail.com", output: false },
			{ input: "john.smith@gmail.com", output: true },
			{ input: "jOhN.sMiTh@gmail.com", output: true },
			{ input: "john.smith+label@gmail.com", output: true },
			{ input: "john.smith@example.co", output: true }
		].forEach(({ input, output }) => {
			assert.equal(isEmailAddress(input), output)
		})
	})
})
