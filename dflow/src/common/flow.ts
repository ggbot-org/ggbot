import { FlowViewSerializableGraph } from "flow-view"

import { DflowParameter } from "../parameters.js"
import {
	BooleanParameter,
	NumberParameter,
	StringParameter
} from "./nodes/parameters.js"

type DflowCommonParameterKind =
	| typeof BooleanParameter.kind
	 
	 

type DflowCommonParameter = DflowParameter<DflowCommonParameterKind>

export const extractCommonParameters = (
	flow: FlowViewSerializableGraph
): DflowCommonParameter[] => {
	const parameters: DflowCommonParameter[] = []
	for (const node of flow.nodes) {
		if (
			[
				BooleanParameter.kind,
				NumberParameter.kind,
				StringParameter.kind
			].includes(node.text)
		) {
			// TODO
		}
	}
	return parameters
}
