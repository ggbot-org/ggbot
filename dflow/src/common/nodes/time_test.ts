import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDflowExecutionOutputData } from "../executor.js";
import { DflowExecutorMock } from "../mocks/executor.js";

describe("today", () => {
  it("reads context timestamp", async () => {
    const day = "1978-12-31";
    const nodeId = "a";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: nodeId,
            text: "today",
          },
        ],
        edges: [],
      },
    });
    const { execution } = await executor.run({
      memory: {},
      timestamp: new Date(day).toJSON(),
    });
    assert.equal(getDflowExecutionOutputData(execution, nodeId, 0), day);
  });
});