import { Dflow, DflowNode } from "dflow"

const { input, output } = Dflow

export class And extends DflowNode {
	static kind = "and"
	static inputs = [input("boolean"), input("boolean")]
	static outputs = [output("boolean")]
	run() {
		this.output(0).data = this.input(0).data && this.input(1).data
	}
}

export class Equal extends DflowNode {
	static kind = "="
	static inputs = [input(), input()]
	static outputs = [output("boolean")]
	run() {
		this.output(0).data = this.input(0).data === this.input(1).data
	}
}

export class Not extends DflowNode {
	static kind = "not"
	static inputs = [input()]
	static outputs = [output("boolean")]
	run() {
		this.output(0).data = !this.input(0).data
	}
}

export class NotEqual extends DflowNode {
	static kind = "!="
	static inputs = [
		input([], { optional: true }),
		input([], { optional: true })
	]
	static outputs = [output("boolean")]
	run() {
		const a = this.input(0).data as unknown
		const b = this.input(1).data as unknown
		if (a === undefined && b === undefined) return this.clearOutputs()
		this.output(0).data = a !== b
	}
}

export class NullishCoaleshing extends DflowNode {
	static kind = "??"
	static inputs = [
		input([], { optional: true }),
		input([], { optional: true })
	]
	static outputs = [output()]
	run() {
		const a = this.input(0).data as unknown
		const b = this.input(1).data as unknown
		if (a === undefined && b === undefined) return this.clearOutputs()
		this.output(0).data = a ?? b
	}
}

export class Or extends DflowNode {
	static kind = "or"
	static inputs = [input(), input()]
	static outputs = [output("boolean")]
	run() {
		this.output(0).data = Boolean(this.input(0).data) || Boolean(this.input(1).data)
	}
}
