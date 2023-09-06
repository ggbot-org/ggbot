import { Backtesting } from "_/components/Backtesting.js"
import { EditableFlow } from "_/components/EditableFlow.js"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { ManageStrategy } from "_/components/user/ManageStrategy.js"
import { PleaseConfigureBinance } from "_/components/user/PleaseConfigureBinance.js"
import { PleasePurchase } from "_/components/user/PleasePurchase.js"
import { StrategyOrders } from "_/components/user/StrategyOrders.js"
import { FC, useState } from "react"

const pageName = "Strategy"

export const Strategy: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "backtesting"
	)

	return (
		<>
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
		</>
	)
}
