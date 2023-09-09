import { Backtesting } from "_/components/Backtesting.js"
import { PageContainer } from "_/components/PageContainer.js"
import { ReadonlyFlow } from "_/components/ReadonlyFlow.js"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { StrategyProvider } from "_/contexts/Strategy.js"
import { StrategyFlowProvider } from "_/contexts/StrategyFlow.js"
import { FC, useState } from "react"

const pageName = "Strategy"

export const StrategyPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "flow"
	)

	return (
		<PageContainer>
			<StrategyProvider>
				<StrategyFlowProvider>
					<Tabs
						pageName={pageName}
						activeTabId={activeTabId}
						setActiveTabId={setActiveTabId}
						tabs={[
							{
								tabId: "backtesting",
								content: <Backtesting />
							},
							{
								tabId: "flow",
								content: <ReadonlyFlow />
							}
						]}
					/>
				</StrategyFlowProvider>
			</StrategyProvider>
		</PageContainer>
	)
}
