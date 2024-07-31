import { Backtesting } from "_/components/Backtesting"
import { TabId, Tabs } from "_/components/Tabs"
import { EditableFlow } from "_/components/user/EditableFlow"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyProvider } from "_/contexts/Strategy"
import { useState } from "react"

export function EditStrategyPage() {
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
