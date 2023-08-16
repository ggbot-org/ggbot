import { FC, useState } from "react"

import { CreateStrategy } from "../components/CreateStrategy.js"
import { Strategies } from "../components/Strategies.js"
import { getStoredTabId, TabId, Tabs } from "../components/Tabs.js"

const pageName = "Dashboard"

export const Dashboard: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "strategies"
	)

	return (
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
	)
}
