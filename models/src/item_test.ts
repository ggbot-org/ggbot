import { describe, test } from "node:test"

import { assertEqual } from "./assertions.js"
import { isItemId } from "./item.js"

describe("isItemId", () => {
	test("validates id as UUID", () => {
		assertEqual<unknown, boolean>(isItemId, [
			{ input: undefined, output: false },
			{ input: 1000, output: false },
			{ input: "", output: false },
			{ input: "12345678", output: true }
		])
	})
})
