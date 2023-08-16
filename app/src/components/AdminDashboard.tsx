import { FC, useState } from "react"

import { Accounts } from "../components/Accounts.js"
import { getStoredTabId, TabId, Tabs } from "../components/Tabs.js"

const pageName = "AdminDashboard"

export const AdminDashboard: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "accounts"
	)

	return (
		<Tabs
			pageName={pageName}
			activeTabId={activeTabId}
			setActiveTabId={setActiveTabId}
			tabs={[
				{
					tabId: "accounts",
					content: <Accounts />
				}
			]}
		/>
	)
}
