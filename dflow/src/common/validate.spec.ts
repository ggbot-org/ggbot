import type { DflowNodesCatalog } from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { ErrorUknownDflowNodes } from "../errors";
import { dflowValidate } from "./validate";

const viewWithUnknownNode: FlowViewSerializableGraph = {
  nodes: [{ id: "nodeId", text: "node", x: 0, y: 0 }],
  edges: [],
};

const nodesCatalog: DflowNodesCatalog = {};

describe("dflowValidate", () => {
  it("throws ErrorUknownDflowNodes", () => {
    expect(() => {
      dflowValidate(nodesCatalog, viewWithUnknownNode);
    }).toThrow(ErrorUknownDflowNodes);
  });
});
