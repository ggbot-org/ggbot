import { describe, test } from "node:test"

import { assertEqual } from "./assertions.js"
import { Balance, isBalance } from "./balance.js"

describe("isBalance", () => {
	test("validates Balance", () => {
		assertEqual<Balance, boolean>(isBalance, [
			{
				input: {
					asset: "BUSD",
					free: "-1000.00",
					locked: "0"
				},
				output: true
			}
		])
	})
})
