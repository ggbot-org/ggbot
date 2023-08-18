import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { now, truncateTime } from "minimal-time-helpers"

import { BinanceDflowHost } from "./host.js"
import { BinanceClientMock } from "./mocks/client.js"
import { getDflowBinanceNodesCatalog } from "./nodesCatalog.js"

describe("BinanceDflowHost", () => {
	describe("load()", () => {
		it("parses a flow view and loads it into a Dflow graph", async () => {
			const binance = new BinanceClientMock()
			const { symbols } = await binance.exchangeInfo()
			const nodesCatalog = getDflowBinanceNodesCatalog(symbols)
			const dflow = new BinanceDflowHost(
				{ nodesCatalog },
				{
					binance,
					input: {},
					memory: {},
					time: truncateTime(now()).to.minute
				}
			)
			dflow.load({
				edges: [],
				nodes: [
					{
						id: "a",
						text: "BTC/BUSD"
					}
				]
			})
			assert.ok(dflow.getNodeById("a") !== undefined)
		})
	})
})
