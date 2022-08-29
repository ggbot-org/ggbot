import { BinanceDflowExecutor } from "./executor";
import { BinanceClientMock } from "./mocks/client";

describe("BinanceDflowExecutor", () => {
  describe("run", () => {
    it("can delete context memory", async () => {
      const binance = new BinanceClientMock();
      const executor = new BinanceDflowExecutor({
        binance,
        view: {
          nodes: [
            {
              id: "a",
              text: '"key1"',
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

    it("can set context memory", async () => {
      const binance = new BinanceClientMock();
      const executor = new BinanceDflowExecutor({
        binance,
        view: {
          nodes: [
            {
              id: "a",
              text: '"key1"',
              type: "data",
              x: 0,
              y: 0,
              outs: [{ id: "b" }],
            },
            {
              id: "c",
              text: "1.2",
              type: "data",
              x: 0,
              y: 0,
              ins: [{ id: "d" }],
            },
            {
              id: "e",
              text: "setMemory",
              x: 0,
              y: 0,
              ins: [{ id: "f" }, { id: "g" }],
            },
          ],
          edges: [
            { id: "h", from: ["a", "b"], to: ["e", "f"] },
            { id: "i", from: ["c", "d"], to: ["e", "g"] },
          ],
        },
      });
      await executor.prepare();
      const { memory, memoryChanged } = await executor.run({
        memory: {},
      });
      expect(memoryChanged).toBe(true);
      expect(memory.key1).toBe(1.2);
    });
  });
});
