import { nodeTextToViewType } from "@ggbot2/dflow"
import { DflowNodesCatalog } from "dflow"
import { FlowView, FlowViewNode } from "flow-view"

import { FlowViewNodeInfo } from "../flow/nodes/info.js"
import { FlowViewNodeJson } from "../flow/nodes/json.js"
import { FlowViewNodePercentage } from "../flow/nodes/percentage.js"

export const initializeFlowView = (
	container: HTMLDivElement,
	nodesCatalog: DflowNodesCatalog
) => {
	const flowView = new FlowView(container)
	flowView.addNodeClass(
		FlowViewNodeInfo.type,
		FlowViewNodeInfo as unknown as FlowViewNode
	)
	flowView.addNodeClass(
		FlowViewNodeJson.type,
		FlowViewNodeJson as unknown as FlowViewNode
	)
	flowView.addNodeClass(
		FlowViewNodePercentage.type,
		FlowViewNodePercentage as unknown as FlowViewNode
	)
	flowView.nodeTextToType((text) => nodeTextToViewType(text))
	flowView.addNodeDefinitions({
		nodes: Object.keys(nodesCatalog)
			.map((kind) => ({ name: kind }))
			.sort()
	})

	return flowView
}
