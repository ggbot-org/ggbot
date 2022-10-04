import { now } from "@ggbot2/time";
import type { DflowNodesCatalog } from "dflow";
import { ErrorUknownDflowNodes } from "../errors";
import { DflowExecutorView } from "./executor";
import { commonNodeTextToDflowKind } from "./nodeResolution";
import { dflowValidate } from "./validate";
import { DflowCommonHostMock } from "./mocks/host";

describe("dflowValidate", () => {
  it("throws ErrorUknownDflowNodes", () => {
    const nodesCatalog: DflowNodesCatalog = {};
    const view: DflowExecutorView = {
      nodes: [{ id: "n1", text: "unknownNode" }],
      edges: [],
    };
    expect(() => {
      dflowValidate({
        nodesCatalog,
        nodeTextToDflowKind: commonNodeTextToDflowKind,
        view,
      });
    }).toThrow(ErrorUknownDflowNodes);
  });

  it("ignores info nodes", () => {
    const nodesCatalog: DflowNodesCatalog = {};
    const view: DflowExecutorView = {
      nodes: [{ id: "n1", text: "this is a comment" }],
      edges: [],
    };
    expect(() => {
      dflowValidate({
        nodesCatalog,
        nodeTextToDflowKind: commonNodeTextToDflowKind,
        view,
      });
    }).not.toThrow(Error);
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
    expect(() => {
      dflowValidate({
        nodesCatalog: dflow.nodesCatalog,
        nodeTextToDflowKind: commonNodeTextToDflowKind,
        view,
      });
    }).not.toThrow(Error);
  });
});
