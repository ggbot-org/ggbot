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
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: now(),
    });
    expect(getDflowExecutionOutputData(execution, nodeId, 0)).toBe(1);
    expect(getDflowExecutionOutputData(execution, nodeId, 1)).toStrictEqual([
      2, 3,
    ]);
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
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: now(),
    });
    expect(getDflowExecutionOutputData(execution, nodeId, 0)).toBe(3);
    expect(getDflowExecutionOutputData(execution, nodeId, 1)).toStrictEqual([
      1, 2,
    ]);
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
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: now(),
    });
    expect(getDflowExecutionOutputData(execution, nodeId, 0)).toStrictEqual([
      1,
      2,
      3,
      { foo: true },
    ]);
  });
});
