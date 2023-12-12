import {
	add,
	decimalToNumber,
	div,
	ErrorCannotDivideByZero,
	mul,
	sub
} from "@workspace/arithmetic"
import { DflowNode } from "dflow"

const { input, output } = DflowNode

export class Addition extends DflowNode {
	static kind = "add"
	static inputs = [input("number"), input("number")]
	static outputs = [output("number")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		const output: number = decimalToNumber(add(a, b))
		this.output(0).data = output
	}
}

export class Subtraction extends DflowNode {
	static kind = "sub"
	static inputs = [input("number"), input("number")]
	static outputs = [output("number")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		const output: number = decimalToNumber(sub(a, b))
		this.output(0).data = output
	}
}

export class Multiplication extends DflowNode {
	static kind = "mul"
	static inputs = [input("number"), input("number")]
	static outputs = [output("number")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		const output: number = decimalToNumber(mul(a, b))
		this.output(0).data = output
	}
}

export class Division extends DflowNode {
	static kind = "div"
	static inputs = [input("number"), input("number")]
	static outputs = [output("number")]
	run() {
		try {
			const a = this.input(0).data as number
			const b = this.input(1).data as number
			const output: number = decimalToNumber(div(a, b))
			this.output(0).data = output
		} catch (error) {
			if (error instanceof ErrorCannotDivideByZero) return
			throw error
		}
	}
}

export class LessThan extends DflowNode {
	static kind = "<"
	static inputs = [input("number"), input("number")]
	static outputs = [output("boolean")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		const output: boolean = a < b
		this.output(0).data = output
	}
}

export class GreaterThan extends DflowNode {
	static kind = ">"
	static inputs = [input("number"), input("number")]
	static outputs = [output("boolean")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		const output: boolean = a > b
		this.output(0).data = output
	}
}
