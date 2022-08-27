import { BinanceDflowExecutor } from "./executor";
import { BinanceClientMock } from "./mocks/client";

describe("BinanceDflowExecutor", () => {
  describe("run", () => {
    it("can change context memory", async () => {
      const binance = new BinanceClientMock();
      const executor = new BinanceDflowExecutor({
        binance,
        view: {
          nodes: [
            {
              id: "a",
              text: "key1",
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
      const { memory, memoryChanged } = await executor.run({
        memory: { key1: "value1" },
      });
      expect(memoryChanged).toBe(true);
      expect(memory.key1).toBe(undefined);
    });
  });
});
