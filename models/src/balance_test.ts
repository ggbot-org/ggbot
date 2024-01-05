import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { Balance, isBalance } from "./balance.js"

void test("isBalance", () => {
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
