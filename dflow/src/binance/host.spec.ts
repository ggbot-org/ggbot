import {
  BinanceClient,
  BinanceConnector,
  BinanceExchange,
} from "@ggbot2/binance";
import { ErrorUknownDflowNodes } from "../errors";
import { BinanceDflowHost } from "./host";

describe("BinanceDflowHost", () => {
  describe("loadView", () => {
    it("throws ErrorUknownDflowNodes", () => {
      expect(() => {
        const view = {
          nodes: [],
          edges: [],
        };
        const client = new BinanceClient({ apiKey: "", apiSecret: "" });
        const exchange = new BinanceExchange({
          baseUrl: BinanceConnector.defaultBaseUrl,
        });
        const dflow = new BinanceDflowHost(
          { nodesCatalog: {} },
          { client, exchange, memory: {} }
        );
        dflow.loadView(view);
      }).toThrow(ErrorUknownDflowNodes);
    });
  });
});
