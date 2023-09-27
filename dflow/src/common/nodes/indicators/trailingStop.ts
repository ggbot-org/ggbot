import { Decimal, decimalToNumber } from "@workspace/arithmetic"
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
	direction,
	marketPrice,
	stopPrice
}: TrailingStopInput): TrailingStopOutput => {
	if (!stopPrice) return { exitTrailing: undefined, stopPrice: undefined }
	const stopPriceNum = decimalToNumber(stopPrice)
	const marketPriceNum = decimalToNumber(marketPrice)
	// If `direction` is "UP" and `marketPrice` is above `stopPrice`, then `exitTrailing` is true.
	if (direction === "UP" && marketPriceNum >= stopPriceNum)
		return { exitTrailing: true, stopPrice }
	// If `direction` is "DOWN" and `marketPrice` is below `stopPrice`, then `exitTrailing` is true.
	if (direction === "DOWN" && marketPriceNum <= stopPriceNum)
		return { exitTrailing: true, stopPrice }
	return { exitTrailing: undefined, stopPrice }
}

export class TrailingStop extends DflowNode {
	static kind = "trailingStop"
}
