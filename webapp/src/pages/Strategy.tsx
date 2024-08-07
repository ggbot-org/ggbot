import { Backtesting } from "_/components/Backtesting"
import { PageContainer } from "_/components/PageContainer"
import { StrategyActions } from "_/components/StrategyActions"
import { TabId, Tabs } from "_/components/Tabs"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useState } from "react"

export function StrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("info")
	const { strategyKey } = useStrategyKey()
	const {
		strategyId,
		strategyName,
		strategyWhenCreated,
		strategyFrequency,
		strategyNotFound,
		readStrategyIsPending
	} = useStrategy(strategyKey)
	return (
		<PageContainer>
			<StrategyPageContainer strategyKey={strategyKey} strategyNotFound={strategyNotFound}>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "info",
							content: (
								<StrategyActions
									readStrategyIsPending={readStrategyIsPending}
									strategyId={strategyId}
									strategyKey={strategyKey}
									strategyName={strategyName}
									strategyWhenCreated={strategyWhenCreated}
								/>
							)
						},
						{
							tabId: "backtesting",
							content: (
								<Backtesting
									strategyFrequency={strategyFrequency}
									strategyKey={strategyKey}
									strategyName={strategyName}
								/>
							)
						}
					]}
				/>
			</StrategyPageContainer>
		</PageContainer>
	)
}
