import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { now } from "@ggbot2/time";
import { getDflowExecutionOutputData } from "../executor.js";
import { DflowExecutorMock } from "../mocks/executor.js";

describe("add", () => {
  it("implements addition", async () => {
    const nodeId = "operator";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "i1",
            text: "2",
            outs: [{ id: "o1" }],
          },
          {
            id: "i2",
            text: "3",
            outs: [{ id: "o2" }],
          },
          {
            id: nodeId,
            text: "add",
            ins: [{ id: "a" }, { id: "b" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e2", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    const { execution } = await executor.run({
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 5);
  });
});

describe("sub", () => {
  it("implements multiplication", async () => {
    const nodeId = "operator";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "i1",
            text: "2",
            outs: [{ id: "o1" }],
          },
          {
            id: "i2",
            text: "3",
            outs: [{ id: "o2" }],
          },
          {
            id: nodeId,
            text: "mul",
            ins: [{ id: "a" }, { id: "b" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e2", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    const { execution } = await executor.run({
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 6);
  });
});

describe("mul", () => {
  it("implements multiplication", async () => {
    const nodeId = "operator";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "i1",
            text: "2",
            outs: [{ id: "o1" }],
          },
          {
            id: "i2",
            text: "3",
            outs: [{ id: "o2" }],
          },
          {
            id: nodeId,
            text: "mul",
            ins: [{ id: "a" }, { id: "b" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e2", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    const { execution } = await executor.run({
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 6);
  });
});

describe("div", () => {
  it("implements multiplication", async () => {
    const nodeId = "operator";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "i1",
            text: "3",
            outs: [{ id: "o1" }],
          },
          {
            id: "i2",
            text: "2",
            outs: [{ id: "o2" }],
          },
          {
            id: nodeId,
            text: "div",
            ins: [{ id: "a" }, { id: "b" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e2", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    const { execution } = await executor.run({
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), 1.5);
  });
});
