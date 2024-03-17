import { Backtesting } from "_/components/Backtesting"
import { PageContainer } from "_/components/PageContainer"
import { ReadonlyFlow } from "_/components/ReadonlyFlow"
import { TabId, Tabs } from "_/components/Tabs"
import { StrategyProvider } from "_/contexts/Strategy"
import { StrategyFlowProvider } from "_/contexts/StrategyFlow"
import { FC, useState } from "react"

export const StrategyPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>("flow")

	return (
		<PageContainer>
			<StrategyProvider>
				<StrategyFlowProvider>
					<Tabs
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
