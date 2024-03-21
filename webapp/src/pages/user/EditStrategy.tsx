import { Backtesting } from "_/components/Backtesting"
import { EditableFlow } from "_/components/EditableFlow"
import { TabId, Tabs } from "_/components/Tabs"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyProvider } from "_/contexts/Strategy"
import { FC, useState } from "react"

export const EditStrategyPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>("flow")

	return (
		<PageContainer>
			<StrategyProvider>
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
			</StrategyProvider>
		</PageContainer>
	)
}
