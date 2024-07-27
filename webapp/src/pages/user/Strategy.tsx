import { TabId, Tabs } from "_/components/Tabs"
import { ManageStrategy } from "_/components/user/ManageStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { PleasePurchase } from "_/components/user/PleasePurchase"
import { StrategyErrors } from "_/components/user/StrategyErrors"
import { StrategyProfits } from "_/components/user/StrategyProfits"
import { StrategyProvider } from "_/contexts/Strategy"
import { ManageStrategyProvider } from "_/contexts/user/ManageStrategy"
import { StrategiesProvider } from "_/contexts/user/Strategies"
import { useState } from "react"

export function StrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("manage")

	return (
		<PageContainer>
			<StrategiesProvider>
				<StrategyProvider>
					<ManageStrategyProvider>
						<Tabs
							activeTabId={activeTabId}
							setActiveTabId={setActiveTabId}
							tabs={[
								{
									tabId: "manage",
									content: <ManageStrategy />
								},
								{
									tabId: "profits",
									content: <StrategyProfits />
								},
								{
									tabId: "errors",
									content: <StrategyErrors />
								}
							]}
						/>

						<PleasePurchase />
					</ManageStrategyProvider>
				</StrategyProvider>
			</StrategiesProvider>
		</PageContainer>
	)
}
