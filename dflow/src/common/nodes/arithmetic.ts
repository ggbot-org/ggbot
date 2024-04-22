import { Dflow, DflowNode } from "dflow"

const { input, output } = Dflow

const binaryOperatorInputs = [input("number"), input("number")]
const binaryOperatorOutputs = [output("number")]

export type MaybeNumber = string | number | undefined

type ValidNumber = number

const isValidNumber = (arg: MaybeNumber): arg is ValidNumber => {
	const num = Number(arg)
	if (Number.isNaN(num)) return false
	return Number.isFinite(num)
}

type BinaryOperator = (
	a: MaybeNumber,
	b: MaybeNumber
) => ValidNumber | undefined

/**
 * Fix floating point issues by coercing to a number with precision eight.
 *
 * @remarks
 * Quantities in crypto do not have precision greater than eight.
 * @example
 *
 * ```ts
 * 0.1 + 0.2 // 0.30000000000000004
 * num8(0.1 + 0.2) // 0.3
 *
 * 1111.11 + 1111.11 + 1111.11 + 1111.11 + 1111.11 // 5555.549999999999
 * num8(1111.11 + 1111.11 + 1111.11 + 1111.11 + 1111.11) // 5555.55
 * ```
 *
 * @internal
 */
const num8 = (n: number) => Number(n.toFixed(8))

export const add: BinaryOperator = (a, b) => {
	if (isValidNumber(a) && isValidNumber(b)) return num8(a + b)
}

export class Addition extends DflowNode {
	static kind = "add"
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = add(a, b)
	}
}

export const sub: BinaryOperator = (a, b) => {
	if (isValidNumber(a) && isValidNumber(b)) return num8(a - b)
}

export class Subtraction extends DflowNode {
	static kind = "sub"
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = sub(a, b)
	}
}

export const mul: BinaryOperator = (a, b) => {
	if (isValidNumber(a) && isValidNumber(b)) return num8(a * b)
}

export class Multiplication extends DflowNode {
	static kind = "mul"
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = mul(a, b)
	}
}

export const div: BinaryOperator = (a, b) => {
	if (!isValidNumber(a) || !isValidNumber(b)) return
	const result = num8(a / b)
	return Number.isFinite(result) ? result : undefined
}

export class Division extends DflowNode {
	static kind = "div"
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = div(a, b)
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
