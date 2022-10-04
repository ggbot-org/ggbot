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
            outs: [{ id: "c" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e1", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: now(),
    });
    expect(getDflowExecutionOutputData(execution, nodeId, 0)).toBe(5);
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
            outs: [{ id: "c" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e1", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: now(),
    });
    expect(getDflowExecutionOutputData(execution, nodeId, 0)).toBe(-1);
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
            outs: [{ id: "c" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e1", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: now(),
    });
    expect(getDflowExecutionOutputData(execution, nodeId, 0)).toBe(6);
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
            outs: [{ id: "c" }],
          },
        ],
        edges: [
          { id: "e1", from: ["i1", "o1"], to: [nodeId, "a"] },
          { id: "e1", from: ["i2", "o2"], to: [nodeId, "b"] },
        ],
      },
    });
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: now(),
    });
    expect(getDflowExecutionOutputData(execution, nodeId, 0)).toBe(1.5);
  });
});
