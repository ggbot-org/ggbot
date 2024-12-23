import { DflowInputDefinition, DflowNode, DflowOutputDefinition } from 'dflow'

import { MaybeNumber } from '../arithmetic'

/**
 * Compute classic bollinger bands.
 * @see {@link https://en.wikipedia.org/wiki/Bollinger_Bands}
 */
export declare function bollinger(values: number[], period: number, amplitude?: number): [lower: MaybeNumber[], middle: MaybeNumber[], upper: MaybeNumber[]]

export declare class Bollinger extends DflowNode {
	static kind: string
	static inputs: DflowInputDefinition[]
	static outputs: DflowOutputDefinition[]
	run(): void
}

export declare class BollingerEMA extends DflowNode {
	static kind: string
	static inputs: DflowInputDefinition[]
	static outputs: DflowOutputDefinition[]
	run(): void
}
