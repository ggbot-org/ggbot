import { FlowViewNodeEditable } from "./editable"

export class FlowViewNodeJson extends FlowViewNodeEditable {
	static type = "json"
	// @ts-expect-error
	init(arg) {
		super.init(arg)
		if (this.outputs.length === 0) this.newOutput({ id: "o" })
	}
}
