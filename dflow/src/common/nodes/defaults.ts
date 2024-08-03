import { DflowNode } from "dflow"

import { inputSymbol } from "./commonIO.js"

export class DefaultSymbol extends DflowNode {
	static kind = "defaultSymbol"
	static inputs = [inputSymbol]
	static outputs = []
	run () {
		// This not does not run any logic.
		// It is used by `extractsBinanceDefaultsFromFlow`.
	}
}
