import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { CreateStrategy } from "_/components/user/CreateStrategy.js"
import { Strategies } from "_/components/user/Strategies.js"
import { FC, useState } from "react"

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
