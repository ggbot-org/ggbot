import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StrategyFlow } from "@ggbot2/models";
import { BinanceClientMock } from "./mocks/client.js";
import { extractBinanceSymbolsFromFlow } from "./symbols.js";

describe("extractBinanceSymbolsFromFlow", () => {
  it("works", async () => {
    const binance = new BinanceClientMock();
    const { symbols } = await binance.exchangeInfo();
    const view: StrategyFlow["view"] = {
      nodes: [
        { id: "a", text: "ETH/BTC", x: 0, y: 0 },
        { id: "b", text: "BTC/BUSD", x: 0, y: 0 },
        // Should not return ETHBTC twice.
        { id: "c", text: "ETH/BTC", x: 0, y: 0 },
      ],
      edges: [],
    };
    assert.deepEqual(
      extractBinanceSymbolsFromFlow({ binanceSymbols: symbols, view }).sort(),
      ["BTCBUSD", "ETHBTC"].sort()
    );
  });
});
