import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { now } from "@ggbot2/time";
import type { DflowNodesCatalog } from "dflow";
import { ErrorUknownDflowNodes } from "../errors.js";
import type { DflowExecutorView } from "./executor.js";
import { commonNodeTextToDflowKind } from "./nodeResolution.js";
import { dflowValidate } from "./validate.js";
import { DflowCommonHostMock } from "./mocks/host.js";

describe("dflowValidate", () => {
  it("throws ErrorUknownDflowNodes", () => {
    const nodesCatalog: DflowNodesCatalog = {};
    const view: DflowExecutorView = {
      nodes: [{ id: "n1", text: "unknownNode" }],
      edges: [],
    };
    assert.throws(
      () => {
        dflowValidate({
          nodesCatalog,
          nodeTextToDflowKind: commonNodeTextToDflowKind,
          view,
        });
      },
      {
        name: "Error",
        message: ErrorUknownDflowNodes.message,
      }
    );
  });

  it("ignores info nodes", () => {
    const nodesCatalog: DflowNodesCatalog = {};
    const view: DflowExecutorView = {
      nodes: [{ id: "n1", text: "this is a comment" }],
      edges: [],
    };
    assert.doesNotThrow(() => {
      dflowValidate({
        nodesCatalog,
        nodeTextToDflowKind: commonNodeTextToDflowKind,
        view,
      });
    }, Error);
  });

  it("validates json nodes", () => {
    const dflow = new DflowCommonHostMock(
      { nodesCatalog: {} },
      { memory: {}, timestamp: now() }
    );
    const view: DflowExecutorView = {
      nodes: [
        { id: "n1", text: '{"message":"hello world"}', outs: [{ id: "o1" }] },
      ],
      edges: [],
    };
    assert.doesNotThrow(() => {
      dflowValidate({
        nodesCatalog: dflow.nodesCatalog,
        nodeTextToDflowKind: commonNodeTextToDflowKind,
        view,
      });
    }, Error);
  });
});
