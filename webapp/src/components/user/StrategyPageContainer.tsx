import { InvalidStrategyKey } from "_/components/InvalidStrategyKey"
import { Section } from "_/components/library"
import { StrategyNotFound } from "_/components/StrategyNotFound"
import { StrategyKey } from "@workspace/models"
import { PropsWithChildren } from "react"

export function StrategyPageContainer({
	strategyKey, strategyNotFound, children
}: PropsWithChildren<{
	strategyKey: StrategyKey | undefined
	strategyNotFound: boolean
}>) {
	if (!strategyKey) return (
		<Section>
			<InvalidStrategyKey />
		</Section>
	)

	if (strategyNotFound) return (
		<Section>
			<StrategyNotFound {...strategyKey} />
		</Section>
	)

	return children
}
