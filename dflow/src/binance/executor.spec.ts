import { BinanceDflowExecutor } from "./executor";
import { BinanceClientMock } from "./mocks/client";

describe("BinanceDflowExecutor", () => {
  describe("run", () => {
    it("can return `memoryChanged` = true", async () => {
      const binance = new BinanceClientMock();
      const executor = new BinanceDflowExecutor({
        binance,
        view: {
          nodes: [
            {
              id: "a",
              text: "label",
              type: "data",
              x: 0,
              y: 0,
              outs: [{ id: "b" }],
            },
            {
              id: "c",
              text: "deleteMemory",
              x: 0,
              y: 0,
              ins: [{ id: "d" }],
            },
          ],
          edges: [{ id: "e", from: ["a", "b"], to: ["c", "d"] }],
        },
      });
      await executor.prepare();
      const { memoryChanged } = await executor.run({ memory: {} });
      expect(memoryChanged).toBe(true);
    });
  });
});
