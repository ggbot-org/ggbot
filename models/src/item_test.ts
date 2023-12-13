import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { isItemId } from "./item.js"

export const invalidId = "not an id"

void describe("isItemId", () => {
	void test("validates id as UUID", () => {
		assertEqual<unknown, boolean>(isItemId, [
			{ input: undefined, output: false },
			{ input: 1000, output: false },
			{ input: "", output: false },
			{ input: "12345678", output: true },
			{ input: invalidId, output: false }
		])
	})
})
