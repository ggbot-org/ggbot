import { Backtesting } from "_/components/Backtesting"
import { PageContainer } from "_/components/PageContainer"
import { StrategyActions } from "_/components/StrategyActions"
import { TabId, Tabs } from "_/components/Tabs"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useState } from "react"

export function StrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("info")
	const { strategyKey } = useStrategyKey()

	return (
		<PageContainer>
			<StrategyPageContainer>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "info",
							content: (
								<StrategyActions
									readOnly
									strategyKey={strategyKey}
								/>
							)
						},
						{
							tabId: "backtesting",
							content: <Backtesting strategyKey={strategyKey} />
						}
					]}
				/>
			</StrategyPageContainer>
		</PageContainer>
	)
}
