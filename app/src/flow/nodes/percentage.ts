import { FlowViewNodeEditable } from "./editable.js"

export class FlowViewNodePercentage extends FlowViewNodeEditable {
	static type = "perc"
	// @ts-ignore
	init(arg) {
		super.init(arg)
		if (this.outputs.length === 0) this.newOutput({ id: "o" })
	}
}
