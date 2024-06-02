import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { isName } from "./name.js"

const nameTooLong = "x".repeat(999)
export const invalidNames = ["", "     ", nameTooLong]

test("isName", () => {
	assertEqual<string, boolean>(isName, [
		{ input: "valid name", output: true },
		...invalidNames.map((input) => ({ input, output: false }))
	])
})
