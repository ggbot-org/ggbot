import { FC, useState } from "react"

import { getStoredTabId, TabId, Tabs } from "../../components/Tabs.js"
import { Accounts } from "./Accounts.js"

const pageName = "AdminDashboard"

export const Dashboard: FC = () => {
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
