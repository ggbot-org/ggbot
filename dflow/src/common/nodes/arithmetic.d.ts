import { DflowNode } from 'dflow'

export type MaybeNumber = string | number | undefined

type ValidNumber = number

type BinaryOperator = (a: MaybeNumber, b: MaybeNumber, precision?: number) => ValidNumber | undefined

export declare const add: BinaryOperator
export declare const sub: BinaryOperator
export declare const mul: BinaryOperator
export declare const div: BinaryOperator

/**
 * Quantities in crypto do not have precision greater than eight.
 */
export declare const defaultPrecision = 8

export declare class Addition extends DflowNode {
	static kind: string
	static inputs: import('dflow').DflowInputDefinition[]
	static outputs: import('dflow').DflowOutputDefinition[]
	run(): void
}

export declare class Subtraction extends DflowNode {
	static kind: string
	static inputs: import('dflow').DflowInputDefinition[]
	static outputs: import('dflow').DflowOutputDefinition[]
	run(): void
}

export declare class Multiplication extends DflowNode {
	static kind: string
	static inputs: import('dflow').DflowInputDefinition[]
	static outputs: import('dflow').DflowOutputDefinition[]
	run(): void
}

export declare class Division extends DflowNode {
	static kind: string
	static inputs: import('dflow').DflowInputDefinition[]
	static outputs: import('dflow').DflowOutputDefinition[]
	run(): void
}

export declare class LessThan extends DflowNode {
	static kind: string
	static inputs: import('dflow').DflowInputDefinition[]
	static outputs: import('dflow').DflowOutputDefinition[]
	run(): void
}

export declare class GreaterThan extends DflowNode {
	static kind: string
	static inputs: import('dflow').DflowInputDefinition[]
	static outputs: import('dflow').DflowOutputDefinition[]
	run(): void
}
