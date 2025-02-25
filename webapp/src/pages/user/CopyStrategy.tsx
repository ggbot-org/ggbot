import { CopyStrategy } from '_/components/user/CopyStrategy'
import { PageContainer } from '_/components/user/PageContainer'
import { StrategyPageContainer } from '_/components/user/StrategyPageContainer'
import { useStrategy } from '_/hooks/useStrategy'
import { useStrategyKey } from '_/hooks/useStrategyKey'

export function CopyStrategyPage() {
	const { strategyKey } = useStrategyKey()
	const { strategyId, strategyName, strategyNotFound, strategyWhenCreated } =
		useStrategy(strategyKey)
	return (
		<PageContainer>
			<StrategyPageContainer
				strategyKey={strategyKey}
				strategyNotFound={strategyNotFound}
			>
				<CopyStrategy
					strategyId={strategyId}
					strategyKey={strategyKey}
					strategyName={strategyName}
					strategyWhenCreated={strategyWhenCreated}
				/>
			</StrategyPageContainer>
		</PageContainer>
	)
}
