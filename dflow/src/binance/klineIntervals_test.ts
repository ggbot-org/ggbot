import { describe, test } from "node:test"

import { assertDeepEqual } from "minimal-assertion-helpers"

import {
	DflowBinanceKlineInterval,
	dflowBinanceKlineIntervals
} from "./klineIntervals.js"

type TestInterval = { interval: DflowBinanceKlineInterval }
const sortIntervals = (values: TestInterval[]) => values
	.slice()
	.sort(
		(a, b) => dflowBinanceKlineIntervals.indexOf(a.interval) -
				dflowBinanceKlineIntervals.indexOf(b.interval)
	)

describe("dflowBinanceKlineIntervals", () => {
	test("can be used to sort intervals", () => {
		assertDeepEqual<TestInterval[], TestInterval[]>(sortIntervals, [
			{
				input: [{ interval: "1d" }, { interval: "1h" }],
				output: [{ interval: "1h" }, { interval: "1d" }]
			}
		])
	})
})
