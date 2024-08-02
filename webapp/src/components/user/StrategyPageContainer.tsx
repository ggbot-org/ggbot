import { InvalidStrategyKey } from "_/components/InvalidStrategyKey"
import { Section } from "_/components/library"
import { StrategyNotFound } from "_/components/StrategyNotFound"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { PropsWithChildren } from "react"

export function StrategyPageContainer({ children }: PropsWithChildren) {
	const { strategyKey } = useStrategyKey()
	const { strategy } = useStrategy(strategyKey)

	if (!strategyKey) return (
		<Section>
			<InvalidStrategyKey />
		</Section>
	)

	if (strategy === undefined) return null

	if (strategy === null) return (
		<Section>
			<StrategyNotFound {...strategyKey} />
		</Section>
	)

	return children
}
