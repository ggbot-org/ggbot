import { CopyStrategy } from "_/components/user/CopyStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useStrategyKey } from "_/hooks/useStrategyKey"

export function CopyStrategyPage() {
	const { strategyKey } = useStrategyKey()
	return (
		<PageContainer>
			<StrategyPageContainer>
				<CopyStrategy strategyKey={strategyKey} />
			</StrategyPageContainer>
		</PageContainer>
	)
}
