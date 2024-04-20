import { Dflow, DflowNode } from "dflow"

const { input, output } = Dflow

const binaryOperatorInputs = [input("number"), input("number")]
const binaryOperatorOutputs = [output("number")]

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
export const num8 = (n: number) => Number(n.toFixed(8))

export type MaybeNumber = number | undefined

export const add = (a: MaybeNumber, b: MaybeNumber) : MaybeNumber => {
	if (typeof a !== 'number'||typeof b !== 'number') return
	if (isNaN(a) || isNaN(b)) return
	return num8(a + b)
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

export const sub = (a: MaybeNumber, b: MaybeNumber) : MaybeNumber => {
	if (typeof a !== 'number'||typeof b !== 'number') return
	if (isNaN(a) || isNaN(b)) return
	return num8(a - b)
}

export class Subtraction extends DflowNode {
	static kind = "sub"
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = sub(a , b)
	}
}

export const mul = (a: MaybeNumber, b: MaybeNumber) : MaybeNumber => {
	if (typeof a !== 'number'||typeof b !== 'number') return
	if (isNaN(a) || isNaN(b)) return
	return num8(a * b)
}

export class Multiplication extends DflowNode {
	static kind = "mul"
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = this.input(0).data as number
		const b = this.input(1).data as number
		this.output(0).data = mul(a , b)
	}
}

export const div = (a: MaybeNumber, b: MaybeNumber) : MaybeNumber => {
	if (typeof a !== 'number'||typeof b !== 'number') return
	if (isNaN(a) || isNaN(b)) return
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
			this.output(0).data = div(a,b)
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
