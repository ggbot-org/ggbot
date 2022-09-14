import { BinanceDflowHost } from "./host";
import { getDflowBinanceNodesCatalog } from "./nodesCatalog";
import { BinanceClientMock } from "./mocks/client";

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
      expect(dflow.getNodeById("a")).toBeDefined();
    });
  });
});
