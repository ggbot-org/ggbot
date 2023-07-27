import { nodeTextToViewType } from "@ggbot2/dflow";
import { DflowNodesCatalog } from "dflow";
import { FlowView, FlowViewNode } from "flow-view";

import {
  FlowViewNodeInfo,
  FlowViewNodeJson,
  FlowViewNodePercentage,
} from "../flow/nodes/index.js";

export const initializeFlowView = (
  container: HTMLDivElement,
  nodesCatalog: DflowNodesCatalog
) => {
  const flowView = new FlowView(container);
  flowView.addNodeClass(
    FlowViewNodeInfo.type,
    FlowViewNodeInfo as unknown as FlowViewNode
  );
  flowView.addNodeClass(
    FlowViewNodeJson.type,
    FlowViewNodeJson as unknown as FlowViewNode
  );
  flowView.addNodeClass(
    FlowViewNodePercentage.type,
    FlowViewNodePercentage as unknown as FlowViewNode
  );
  flowView.nodeTextToType((text) => nodeTextToViewType(text));
  flowView.addNodeDefinitions({
    nodes: Object.keys(nodesCatalog)
      .map((kind) => ({ name: kind }))
      .sort(),
  });

  return flowView;
};
