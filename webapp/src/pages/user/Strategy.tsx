import { Backtesting } from "_/components/Backtesting.js"
import { EditableFlow } from "_/components/EditableFlow.js"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { ManageStrategy } from "_/components/user/ManageStrategy.js"
import { PageContainer } from "_/components/user/PageContainer.js"
import { PleaseConfigureBinance } from "_/components/user/PleaseConfigureBinance.js"
import { PleasePurchase } from "_/components/user/PleasePurchase.js"
import { StrategyOrders } from "_/components/user/StrategyOrders.js"
import { StrategyProvider } from "_/contexts/Strategy.js"
import { StrategyFlowProvider } from "_/contexts/StrategyFlow.js"
import { BinanceApiConfigProvider } from "_/contexts/user/BinanceApiConfig.js"
import { ManageStrategyProvider } from "_/contexts/user/ManageStrategy.js"
import { StrategiesProvider } from "_/contexts/user/Strategies.js"
import { SubscriptionProvider } from "_/contexts/user/Subscription.js"
import { FC, useState } from "react"

const pageName = "Strategy"

export const StrategyPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "backtesting"
	)

	return (
		<PageContainer>
			<StrategiesProvider>
				<SubscriptionProvider>
					<BinanceApiConfigProvider>
						<StrategyProvider>
							<StrategyFlowProvider>
								<ManageStrategyProvider>
									<Tabs
										pageName={pageName}
										activeTabId={activeTabId}
										setActiveTabId={setActiveTabId}
										tabs={[
											{
												tabId: "manage",
												content: <ManageStrategy />
											},
											{
												tabId: "orders",
												content: <StrategyOrders />
											},
											{
												tabId: "backtesting",
												content: <Backtesting />
											},
											{
												tabId: "flow",
												content: <EditableFlow />
											}
										]}
									/>

									<PleaseConfigureBinance />

									<PleasePurchase />
								</ManageStrategyProvider>
							</StrategyFlowProvider>
						</StrategyProvider>
					</BinanceApiConfigProvider>
				</SubscriptionProvider>
			</StrategiesProvider>
		</PageContainer>
	)
}
