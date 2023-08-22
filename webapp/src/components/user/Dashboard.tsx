import { FC, useState } from "react"

import { getStoredTabId, TabId, Tabs } from "../Tabs.js"
import { CreateStrategy } from "./CreateStrategy.js"
import { Strategies } from "./Strategies.js"

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
