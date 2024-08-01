import { Backtesting } from "_/components/Backtesting"
import { TabId, Tabs } from "_/components/Tabs"
import { FlowEditor } from "_/components/user/FlowEditor"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useState } from "react"

export function EditStrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("flow")

	return (
		<PageContainer>
			<StrategyPageContainer>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "flow",
							content: <FlowEditor />
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
