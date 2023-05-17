import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { now } from "@ggbot2/time";

import { getDflowExecutionOutputData } from "../executor.js";
import { DflowExecutorMock } from "../mocks/executor.js";

describe("shift", () => {
  it("implements Array.prototype.shift()", async () => {
    const nodeId = "operator";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "array",
            text: "[1,2,3]",
            outs: [{ id: "out" }],
          },
          {
            id: nodeId,
            text: "shift",
            ins: [{ id: "in" }],
          },
        ],
        edges: [{ id: "e1", from: ["array", "out"], to: [nodeId, "in"] }],
      },
    });
    const { execution } = await executor.run({
      input: {},
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 1);
    assert.deepEqual(getDflowExecutionOutputData(execution, nodeId, 1), [2, 3]);
  });
});

describe("pop", () => {
  it("implements Array.prototype.pop()", async () => {
    const nodeId = "operator";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "array",
            text: "[1,2,3]",
            outs: [{ id: "out" }],
          },
          {
            id: nodeId,
            text: "pop",
            ins: [{ id: "in" }],
          },
        ],
        edges: [{ id: "e1", from: ["array", "out"], to: [nodeId, "in"] }],
      },
    });
    const { execution } = await executor.run({
      input: {},
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 3);
    assert.deepEqual(getDflowExecutionOutputData(execution, nodeId, 1), [1, 2]);
  });
});

describe("push", () => {
  it("implements Array.prototype.push()", async () => {
    const nodeId = "operator";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "array",
            text: "[1,2,3]",
            outs: [{ id: "out1" }],
          },
          {
            id: "element",
            text: '{ "foo": true }',
            outs: [{ id: "out2" }],
          },
          {
            id: nodeId,
            text: "push",
            ins: [{ id: "in1" }, { id: "in2" }],
          },
        ],
        edges: [
          { id: "e1", from: ["array", "out1"], to: [nodeId, "in1"] },
          { id: "e2", from: ["element", "out2"], to: [nodeId, "in2"] },
        ],
      },
    });
    const { execution } = await executor.run({
      input: {},
      memory: {},
      time: now(),
    });
    assert.deepEqual(getDflowExecutionOutputData(execution, nodeId, 0), [
      1,
      2,
      3,
      { foo: true },
    ]);
  });
});
