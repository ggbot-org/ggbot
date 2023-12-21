import { Backtesting } from "_/components/Backtesting"
import { EditableFlow } from "_/components/EditableFlow"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs"
import { ManageStrategy } from "_/components/user/ManageStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { PleaseConfigureBinance } from "_/components/user/PleaseConfigureBinance"
import { PleasePurchase } from "_/components/user/PleasePurchase"
import { StrategyOrders } from "_/components/user/StrategyOrders"
import { StrategyProvider } from "_/contexts/Strategy"
import { StrategyFlowProvider } from "_/contexts/StrategyFlow"
import { BinanceApiConfigProvider } from "_/contexts/user/BinanceApiConfig"
import { ManageStrategyProvider } from "_/contexts/user/ManageStrategy"
import { StrategiesProvider } from "_/contexts/user/Strategies"
import { PageName } from "_/routing/pageNames"
import { FC, useState } from "react"

const pageName: PageName = "Strategy"

export const StrategyPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "backtesting"
	)

	return (
		<PageContainer>
			<StrategiesProvider>
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
			</StrategiesProvider>
		</PageContainer>
	)
}
