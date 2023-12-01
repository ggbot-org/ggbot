import { FlowViewSerializableGraph } from "flow-view"

// TODO welcomeFlow is defined in models/src/strategyFlow
// should emptyFlow be defined in the same file?
// if yes, flow-view is a dependency of models, not dflow
// this would also solve the issue that StrategyFlow['view'] is not typed as FlowViewSerializableGraph
export const emptyFlow = (): FlowViewSerializableGraph => ({
	nodes: [],
	edges: []
})
