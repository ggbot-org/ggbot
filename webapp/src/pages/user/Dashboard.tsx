import { TabId, Tabs } from "_/components/Tabs"
import { CreateStrategy } from "_/components/user/CreateStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { Strategies } from "_/components/user/Strategies"
import { useState } from "react"

export function DashboardPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("strategies")
	return (
		<PageContainer>
			<Tabs
				activeTabId={activeTabId}
				setActiveTabId={setActiveTabId}
				tabs={[
					{
						tabId: "strategies",
						content: (
							<Strategies
								goCreateStrategy={() => setActiveTabId("newStrategy")}
							/>
						)
					},
					{
						tabId: "newStrategy",
						content: <CreateStrategy />
					}
				]}
			/>
		</PageContainer>
	)
}
