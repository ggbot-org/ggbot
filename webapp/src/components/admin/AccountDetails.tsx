import { AccountStrategies } from "_/components/admin/AccountStrategies.js"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { FC, useState } from "react"

const pageName = "AdminAccountDetails"

export const AccountDetails: FC = () => {
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
					tabId: "manage",
					content: <AccountStrategies />
				}
			]}
		/>
	)
}
