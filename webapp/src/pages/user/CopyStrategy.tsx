import { CopyStrategy } from "_/components/user/CopyStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyProvider } from "_/contexts/Strategy"

export function CopyStrategyPage() {
	return (
		<PageContainer>
			<StrategyProvider>
				<CopyStrategy />
			</StrategyProvider>
		</PageContainer>
	)
}
