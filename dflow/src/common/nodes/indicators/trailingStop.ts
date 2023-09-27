import { Decimal } from "@workspace/arithmetic"
import { DflowNode } from "dflow"

export type TrailingStopInput = {
	direction: "UP" | "DOWN"
	marketPrice: Decimal
	percentageDelta: Decimal
	stopPrice: Decimal | undefined
}

export type TrailingStopOutput = {
	exitTrailing: boolean | undefined
	stopPrice: Decimal | undefined
}

export const trailingStop = ({
	stopPrice
}: TrailingStopInput): TrailingStopOutput => {
	if (!stopPrice) return { exitTrailing: undefined, stopPrice }
	return { exitTrailing: undefined, stopPrice }
}

export class TrailingStop extends DflowNode {
	static kind = "trailingStop"
}
