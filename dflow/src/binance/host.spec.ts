import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BinanceDflowHost } from "./host.js";
import { getDflowBinanceNodesCatalog } from "./nodesCatalog.js";
import { BinanceClientMock } from "./mocks/client.js";

describe("BinanceDflowHost", () => {
  describe("load()", () => {
    it("parses a flow view and loads it into a Dflow graph", async () => {
      const binance = new BinanceClientMock();
      const { symbols } = await binance.exchangeInfo();
      const nodesCatalog = getDflowBinanceNodesCatalog({ symbols });
      const dflow = new BinanceDflowHost({ nodesCatalog }, { binance });
      dflow.load({
        edges: [],
        nodes: [
          {
            id: "a",
            text: "BTC/BUSD",
          },
        ],
      });
      assert.ok(dflow.getNodeById("a") !== undefined);
    });
  });
});
