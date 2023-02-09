import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { now } from "@ggbot2/time";
import { getDflowExecutionOutputData } from "../executor.js";
import { DflowExecutorMock } from "../mocks/executor.js";

describe("inputNumber", () => {
  it("reads context inputs", async () => {
    const nodeId = "test";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "k",
            text: '"num"',
            outs: [{ id: "o1" }],
          },
          {
            id: "v",
            text: "2",
            outs: [{ id: "o2" }],
          },
          {
            id: nodeId,
            text: "inputNumber",
            ins: [{ id: "i1" }, { id: "i2" }],
            outs: [{ id: "o1" }],
          },
        ],
        edges: [
          { id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
          { id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] },
        ],
      },
    });
    const value = 10;
    const { execution } = await executor.run({
      input: { num: value },
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), value);
  });

  it("use default input if context input is not available", async () => {
    const nodeId = "test";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: "k",
            text: '"num"',
            outs: [{ id: "o1" }],
          },
          {
            id: "v",
            text: "-1.2",
            outs: [{ id: "o2" }],
          },
          {
            id: nodeId,
            text: "inputNumber",
            ins: [{ id: "i1" }, { id: "i2" }],
            outs: [{ id: "o1" }],
          },
        ],
        edges: [
          { id: "e1", from: ["k", "o1"], to: [nodeId, "i1"] },
          { id: "e2", from: ["v", "o2"], to: [nodeId, "i2"] },
        ],
      },
    });
    const { execution } = await executor.run({
      input: {},
      memory: {},
      time: now(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), -1.2);
  });
});
