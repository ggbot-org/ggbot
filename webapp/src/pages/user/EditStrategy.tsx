import { Backtesting } from "_/components/Backtesting"
import { TabId, Tabs } from "_/components/Tabs"
import { FlowEditor } from "_/components/user/FlowEditor"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useState } from "react"

export function EditStrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("flow")
	const { strategyKey } = useStrategyKey()

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
							content: <Backtesting strategyKey={strategyKey} />
						}
					]}
				/>
			</StrategyPageContainer>
		</PageContainer>
	)
}
