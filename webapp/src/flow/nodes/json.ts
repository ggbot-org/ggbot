import { FlowViewNodeEditable } from "./editable.js"

export class FlowViewNodeJson extends FlowViewNodeEditable {
	static type = "json"
	// @ts-ignore
	init(arg) {
		super.init(arg)
		if (this.outputs.length === 0) this.newOutput({ id: "o" })
	}
}