import { DflowNode } from "dflow"

const { input, output } = DflowNode

export class If extends DflowNode {
	static kind = "if"
	static inputs = [
		input([], { name: "condition" }),
		input([], { name: "then" }),
		input([], { name: "else" })
	]
	static outputs = [output()]
	run() {
		this.output(0).data = this.input(0).data
			? this.input(1).data
			: this.input(2).data
	}
}
