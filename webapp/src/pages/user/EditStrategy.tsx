import { Backtesting } from "_/components/Backtesting"
import { EditableFlow } from "_/components/EditableFlow"
import { TabId, Tabs } from "_/components/Tabs"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyProvider } from "_/contexts/Strategy"
import { StrategyFlowProvider } from "_/contexts/StrategyFlow"
import { StrategiesProvider } from "_/contexts/user/Strategies"
import { FC, useState } from "react"

export const EditStrategyPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>("backtesting")

	return (
		<PageContainer>
			<StrategiesProvider>
				<StrategyProvider>
					<StrategyFlowProvider>
						<Tabs
							activeTabId={activeTabId}
							setActiveTabId={setActiveTabId}
							tabs={[
								{
									tabId: "flow",
									content: <EditableFlow />
								},
								{
									tabId: "backtesting",
									content: <Backtesting />
								}
							]}
						/>
					</StrategyFlowProvider>
				</StrategyProvider>
			</StrategiesProvider>
		</PageContainer>
	)
}
