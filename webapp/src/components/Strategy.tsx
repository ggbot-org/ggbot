import { Backtesting } from "_/components/Backtesting.js"
import { ReadonlyFlow } from "_/components/ReadonlyFlow.js"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { FC, useState } from "react"

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
