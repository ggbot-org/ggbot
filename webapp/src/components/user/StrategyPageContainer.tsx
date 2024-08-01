import { InvalidStrategyKey } from "_/components/InvalidStrategyKey"
import { StrategyNotFound } from "_/components/StrategyNotFound"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { PropsWithChildren } from "react"

export function StrategyPageContainer({ children }: PropsWithChildren) {
	const { strategyKey } = useStrategyKey()
	const { strategy } = useStrategy(strategyKey)

	if (!strategyKey) return <InvalidStrategyKey />

	if (strategy === undefined) return null

	if (strategy === null) return <StrategyNotFound {...strategyKey} />

	return children
}
