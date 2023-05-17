import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

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
    const { memory, memoryChanged } = await executor.run({
      input: {},
      memory: { key1: "value1" },
      time: now(),
    });
    assert.equal(memoryChanged, true);
    assert.equal(memory.key1, undefined);
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
    const value = "value1";
    const { execution, memory, memoryChanged } = await executor.run({
      input: {},
      memory: { key1: value },
      time: now(),
    });
    assert.equal(memoryChanged, false);
    assert.equal(memory.key1, value);
    assert.equal(getDflowExecutionOutputData(execution, "c", 0), value);
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
    const { memory, memoryChanged } = await executor.run({
      input: {},
      memory: {},
      time: now(),
    });
    assert.equal(memoryChanged, true);
    assert.equal(memory.key1, 1.2);
  });
});
