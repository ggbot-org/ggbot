import { Backtesting } from "_/components/Backtesting"
import { PageContainer } from "_/components/PageContainer"
import { StrategyActions } from "_/components/StrategyActions"
import { TabId, Tabs } from "_/components/Tabs"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useState } from "react"

export function StrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("info")

	return (
		<PageContainer>
			<StrategyPageContainer>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "info",
							content: <StrategyActions readOnly />
						},
						{
							tabId: "backtesting",
							content: <Backtesting />
						}
					]}
				/>
			</StrategyPageContainer>
		</PageContainer>
	)
}
