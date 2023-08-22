import { FC, useState } from "react"

import { Backtesting } from "./Backtesting.js"
import { ReadonlyFlow } from "./ReadonlyFlow.js"
import { getStoredTabId, TabId, Tabs } from "./Tabs.js"

const pageName = "Strategy"

export const Strategy: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "flow"
	)

	return (
		<Tabs
			pageName={pageName}
			activeTabId={activeTabId}
			setActiveTabId={setActiveTabId}
			tabs={[
				{
					tabId: "backtesting",
					content: <Backtesting />
				},
				{
					tabId: "flow",
					content: <ReadonlyFlow />
				}
			]}
		/>
	)
}
