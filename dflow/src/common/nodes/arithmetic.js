import {Dflow, DflowNode} from 'dflow'

const {input, output} = Dflow

const binaryOperatorInputs = [input('number'), input('number')]
const binaryOperatorOutputs = [output('number')]

/**
 * @internal
 * @param {unknown} arg
 * @returns {arg is number}
 */
function isValidNumber(arg) {
	const num = Number(arg)
	if (Number.isNaN(num)) return false
	return Number.isFinite(num)
}
/** @type {import('./arithmetic').defaultPrecision} */
export const defaultPrecision = 8

/**
 * Fix floating point issues by coercing to a number with precision eight.
 *
 * @internal
 *
 * @example
 *
 * ```js
 * 0.1 + 0.2 // 0.30000000000000004
 * num(0.1 + 0.2) // 0.3
 *
 * 1111.11 + 1111.11 + 1111.11 + 1111.11 + 1111.11 // 5555.549999999999
 * num(1111.11 + 1111.11 + 1111.11 + 1111.11 + 1111.11) // 5555.55
 * ```
 *
 * @param {number} n
 * @param {number=} precision
 */
function num(n, precision = defaultPrecision) {
	return Number(n.toFixed(precision))
}

/** @type {import('./arithmetic').BinaryOperator} */
export const add = (a, b, precision) => {
	if (isValidNumber(a) && isValidNumber(b)) return num(a + b, precision)
}

export class Addition extends DflowNode {
	static kind = 'add'
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = /** @type {number} */ (this.input(0).data)
		const b = /** @type {number} */ (this.input(1).data)
		this.output(0).data = add(a, b)
	}
}

/** @type {import('./arithmetic').BinaryOperator} */
export const sub = (a, b, precision) => {
	if (isValidNumber(a) && isValidNumber(b)) return num(a - b, precision)
}

export class Subtraction extends DflowNode {
	static kind = 'sub'
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = /** @type {number} */ (this.input(0).data)
		const b = /** @type {number} */ (this.input(1).data)
		this.output(0).data = sub(a, b)
	}
}

/** @type {import('./arithmetic').BinaryOperator} */
export const mul = (a, b, precision) => {
	if (isValidNumber(a) && isValidNumber(b)) return num(a * b, precision)
}

export class Multiplication extends DflowNode {
	static kind = 'mul'
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = /** @type {number} */ (this.input(0).data)
		const b = /** @type {number} */ (this.input(1).data)
		this.output(0).data = mul(a, b)
	}
}

/** @type {import('./arithmetic').BinaryOperator} */
export const div = (a, b, precision) => {
	if (!isValidNumber(a) || !isValidNumber(b)) return
	const result = num(a / b, precision)
	return Number.isFinite(result) ? result : undefined
}

export class Division extends DflowNode {
	static kind = 'div'
	static inputs = binaryOperatorInputs
	static outputs = binaryOperatorOutputs
	run() {
		const a = /** @type {number} */ (this.input(0).data)
		const b = /** @type {number} */ (this.input(1).data)
		this.output(0).data = div(a, b)
	}
}

export class LessThan extends DflowNode {
	static kind = '<'
	static inputs = binaryOperatorInputs
	static outputs = [output('boolean')]
	run() {
		const a = /** @type {number} */ (this.input(0).data)
		const b = /** @type {number} */ (this.input(1).data)
		this.output(0).data = a < b
	}
}

export class GreaterThan extends DflowNode {
	static kind = '>'
	static inputs = binaryOperatorInputs
	static outputs = [output('boolean')]
	run() {
		const a = /** @type {number} */ (this.input(0).data)
		const b = /** @type {number} */ (this.input(1).data)
		this.output(0).data = a > b
	}
}
