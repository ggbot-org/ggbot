import { InvalidStrategyKey } from "_/components/InvalidStrategyKey"
import { StrategyNotFound } from "_/components/StrategyNotFound"
import { StrategyKey } from "@workspace/models"
import { PropsWithChildren } from "react"

export function StrategyPageContainer({
	strategyKey, strategyNotFound, children
}: PropsWithChildren<{
	strategyKey: StrategyKey | undefined
	strategyNotFound: boolean
}>) {
	if (!strategyKey) return <InvalidStrategyKey />

	if (strategyNotFound) return <StrategyNotFound {...strategyKey} />

	return children
}
