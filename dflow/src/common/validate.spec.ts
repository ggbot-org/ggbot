import type { DflowNodesCatalog } from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { ErrorUknownDflowNodes } from "../errors";
import { dflowValidate } from "./validate";

describe("dflowValidate", () => {
  it("throws ErrorUknownDflowNodes", () => {
    const nodesCatalog: DflowNodesCatalog = {};
    const view: FlowViewSerializableGraph = {
      nodes: [{ id: "nodeId", text: "unknown node", x: 0, y: 0 }],
      edges: [],
    };
    expect(() => {
      dflowValidate(nodesCatalog, view);
    }).toThrow(ErrorUknownDflowNodes);
  });
});
