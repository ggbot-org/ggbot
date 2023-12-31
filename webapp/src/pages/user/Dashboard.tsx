import { getStoredTabId, TabId, Tabs } from "_/components/Tabs"
import { CreateStrategy } from "_/components/user/CreateStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { Strategies, StrategiesProps } from "_/components/user/Strategies"
import { StrategiesProvider } from "_/contexts/user/Strategies"
import { PageName } from "_/routing/pageNames"
import { FC, useCallback, useState } from "react"

const pageName: PageName = "Dashboard"

export const DashboardPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "strategies"
	)

	const goCreateStrategy = useCallback<StrategiesProps["goCreateStrategy"]>(
		(event) => {
			event.preventDefault()
			setActiveTabId("newStrategy")
		},
		[]
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
							content: (
								<Strategies
									goCreateStrategy={goCreateStrategy}
								/>
							)
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
