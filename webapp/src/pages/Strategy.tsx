import { Backtesting } from "_/components/Backtesting"
import { PageContainer } from "_/components/PageContainer"
import { StrategyActions } from "_/components/StrategyActions"
import { TabId, Tabs } from "_/components/Tabs"
import { StrategyProvider } from "_/contexts/Strategy"
import { FC, useState } from "react"

export const StrategyPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>("info")

	return (
		<PageContainer>
			<StrategyProvider>
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
			</StrategyProvider>
		</PageContainer>
	)
}
