import { Accounts } from "_/components/admin/Accounts.js"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { FC, useState } from "react"

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
