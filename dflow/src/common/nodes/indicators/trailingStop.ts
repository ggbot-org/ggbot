import { Decimal } from "@workspace/arithmetic"
import { DflowNode } from "dflow"

export const trailingStop = ({
	stopPrice
}: {
	// percentageDelta: Decimal,
	stopPrice: Decimal | undefined
	// marketPrice: Decimal,
}): {
	stopPrice: Decimal | undefined
} => ({ stopPrice })

export class TrailingStop extends DflowNode {
	static kind = "trailingStop"
}
