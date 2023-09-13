import { getStoredTabId, TabId, Tabs } from "_/components/Tabs"
import { CreateStrategy } from "_/components/user/CreateStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { Strategies } from "_/components/user/Strategies"
import { StrategiesProvider } from "_/contexts/user/Strategies"
import { FC, useState } from "react"

const pageName = "Dashboard"

export const DashboardPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "strategies"
	)

	return (
		<PageContainer>
			<StrategiesProvider>
				<Tabs
					pageName={pageName}
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "strategies",
							content: <Strategies />
						},
						{
							tabId: "newStrategy",
							content: <CreateStrategy />
						}
					]}
				/>
			</StrategiesProvider>
		</PageContainer>
	)
}
