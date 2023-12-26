import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { Decimal, MaybeDecimal } from "./decimal.js"
import { add, div, equal, mul, sub } from "./operators.js"

type AB = { a: MaybeDecimal; b: MaybeDecimal }
type ABN = AB & { numDecimals?: number }

void describe("equal", () => {
	void test("checks if two MaybeDecimal values are equal considering their actual number of decimals", () => {
		assertEqual<AB, boolean>(
			({ a, b }: AB) => equal(a, b),
			[
				{ input: { a: "0.00", b: 0 }, output: true },
				{ input: { a: "0.001", b: 0 }, output: false },
				{ input: { a: "1", b: "-1" }, output: false },
				{ input: { a: "1", b: "1" }, output: true },
				{ input: { a: "1.0", b: "1" }, output: true },
				{ input: { a: "1.02", b: "1.020" }, output: true },
				{ input: { a: "-1.2300", b: "-1.230" }, output: true }
			]
		)
	})
})

void describe("add", () => {
	void test("implements addition", () => {
		assertEqual<ABN, Decimal>(
			({ a, b, numDecimals }: ABN) => add(a, b, numDecimals),
			[
				{
					input: { a: "0", b: "1", numDecimals: 2 },
					output: "1.00"
				},
				{
					input: { a: "0.1", b: "0.2" },
					output: "0.3"
				}
			]
		)
	})
})

void describe("sub", () => {
	void test("implements subtraction", () => {
		assertEqual<ABN, Decimal>(
			({ a, b, numDecimals }: ABN) => sub(a, b, numDecimals),
			[
				{
					input: { a: "0", b: "1", numDecimals: 2 },
					output: "-1.00"
				}
			]
		)
	})
})

void describe("mul", () => {
	void test("implements multiplication", () => {
		assertEqual<ABN, Decimal>(
			({ a, b, numDecimals }: ABN) => mul(a, b, numDecimals),
			[
				{
					input: { a: "1", b: "1", numDecimals: 2 },
					output: "1.00"
				},
				{
					input: { a: "10.00", b: 2, numDecimals: 2 },
					output: "20.00"
				},
				{
					input: {
						a: "0.00096000",
						b: "20649.57000000",
						numDecimals: 8
					},
					output: "19.82358720"
				}
			]
		)
	})
})

void describe("div", () => {
	void test("implements division", () => {
		assertEqual<ABN, Decimal>(
			({ a, b, numDecimals }: ABN) => div(a, b, numDecimals),
			[
				{
					input: { a: "1", b: "1", numDecimals: 2 },
					output: "1.00"
				}
			]
		)
	})
})
