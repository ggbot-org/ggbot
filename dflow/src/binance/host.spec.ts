import { BinanceDflowHost } from "./host";
import { getDflowBinanceNodesCatalog } from "./nodesCatalog";
import { BinanceClientMock } from "./mocks/client";

describe("BinanceDflowHost", () => {
  describe("load()", () => {
    it("parses a flow view and loads it into a Dflow graph", async () => {
      const binance = new BinanceClientMock();
      const nodesCatalog = await getDflowBinanceNodesCatalog({ binance });
      const dflow = new BinanceDflowHost(
        { nodesCatalog },
        { binance, memory: {} }
      );
      dflow.load({
        edges: [],
        nodes: [
          {
            id: "a",
            text: "BTC/BUSD",
            x: 0,
            y: 0,
          },
        ],
      });
      expect(dflow.getNodeById("a")).toBeDefined();
    });
  });
});
