import { now } from "@ggbot2/time";
import { getDflowExecutionOutputData } from "../executor.js";
import { DflowExecutorMock } from "../mocks/executor.js";

describe("deleteMemory", () => {
  it("can delete context memory", async () => {
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "a",
            text: '"key1"',
            outs: [{ id: "b" }],
          },
          {
            id: "c",
            text: "deleteMemory",
            ins: [{ id: "d" }],
          },
        ],
        edges: [{ id: "e", from: ["a", "b"], to: ["c", "d"] }],
      },
    });
    await executor.prepare();
    const { memory, memoryChanged } = await executor.run({
      memory: { key1: "value1" },
      timestamp: now(),
    });
    expect(memoryChanged).toBe(true);
    expect(memory.key1).toBe(undefined);
  });
});

describe("getMemory", () => {
  it("can read context memory", async () => {
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "a",
            text: '"key1"',
            outs: [{ id: "b" }],
          },
          {
            id: "c",
            text: "getMemory",
            ins: [{ id: "d" }],
          },
        ],
        edges: [{ id: "e", from: ["a", "b"], to: ["c", "d"] }],
      },
    });
    await executor.prepare();
    const value = "value1";
    const { execution, memory, memoryChanged } = await executor.run({
      memory: { key1: value },
      timestamp: now(),
    });
    expect(memoryChanged).toBe(false);
    expect(memory.key1).toBe(value);
    expect(getDflowExecutionOutputData(execution, "c", 0)).toBe(value);
  });
});

describe("setMemory", () => {
  it("can set context memory", async () => {
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "a",
            text: '"key1"',
            outs: [{ id: "b" }],
          },
          {
            id: "c",
            text: "1.2",
            outs: [{ id: "d" }],
          },
          {
            id: "e",
            text: "setMemory",
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
      timestamp: now(),
    });
    expect(memoryChanged).toBe(true);
    expect(memory.key1).toBe(1.2);
  });
});
