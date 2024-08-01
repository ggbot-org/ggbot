import { CopyStrategy } from "_/components/user/CopyStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"

export function CopyStrategyPage() {
	return (
		<PageContainer>
			<StrategyPageContainer>
				<CopyStrategy />
			</StrategyPageContainer>
		</PageContainer>
	)
}
