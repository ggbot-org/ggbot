import { FlowViewNodeInfo } from "_/flow/nodes/info.js"
import { FlowViewNodeJson } from "_/flow/nodes/json.js"
import { FlowViewNodePercentage } from "_/flow/nodes/percentage.js"
import { nodeTextToViewType } from "@workspace/dflow"
import { DflowNodesCatalog } from "dflow"
import { FlowView, FlowViewNode } from "flow-view"

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
