import type { DflowNodesCatalog } from "dflow";
import { ErrorUknownDflowNodes } from "../errors";
import { DflowExecutorView } from "./executor";
import { dflowValidate } from "./validate";

describe("dflowValidate", () => {
  it("throws ErrorUknownDflowNodes", () => {
    const nodesCatalog: DflowNodesCatalog = {};
    const view: DflowExecutorView = {
      nodes: [{ id: "nodeId", text: "unknown node" }],
      edges: [],
    };
    expect(() => {
      dflowValidate(nodesCatalog, view);
    }).toThrow(ErrorUknownDflowNodes);
  });
});
