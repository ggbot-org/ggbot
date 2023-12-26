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

const binaryOperatorInputs = [input("number"), input("number")]

export class Addition extends DflowNode {
	static kind = "add"
	static inputs = binaryOperatorInputs
	static outputs = [output("number")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = decimalToNumber(add(a, b))
	}
}

export class Subtraction extends DflowNode {
	static kind = "sub"
	static inputs = binaryOperatorInputs
	static outputs = [output("number")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = decimalToNumber(sub(a, b))
	}
}

export class Multiplication extends DflowNode {
	static kind = "mul"
	static inputs = binaryOperatorInputs
	static outputs = [output("number")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = decimalToNumber(mul(a, b))
	}
}

export class Division extends DflowNode {
	static kind = "div"
	static inputs = binaryOperatorInputs
	static outputs = [output("number")]
	run() {
		try {
			const a = this.input(0).data as number
			const b = this.input(1).data as number
			this.output(0).data = decimalToNumber(div(a, b))
		} catch (error) {
			if (error instanceof ErrorCannotDivideByZero)
				return this.clearOutputs()
			throw error
		}
	}
}

export class LessThan extends DflowNode {
	static kind = "<"
	static inputs = binaryOperatorInputs
	static outputs = [output("boolean")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = a < b
	}
}

export class GreaterThan extends DflowNode {
	static kind = ">"
	static inputs = binaryOperatorInputs
	static outputs = [output("boolean")]
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = a > b
	}
}
