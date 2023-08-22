import { FC, useState } from "react"

import { Backtesting } from "../Backtesting.js"
import { EditableFlow } from "../EditableFlow.js"
import { getStoredTabId, TabId, Tabs } from "../Tabs.js"
import { ManageStrategy } from "./ManageStrategy.js"
import { PleaseConfigureBinance } from "./PleaseConfigureBinance.js"
import { PleasePurchase } from "./PleasePurchase.js"
import { StrategyOrders } from "./StrategyOrders.js"

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
