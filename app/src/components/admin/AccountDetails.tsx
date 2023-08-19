import { FC, useState } from "react"

import { getStoredTabId, TabId, Tabs } from "../Tabs.js"
import { AccountStrategies } from "./AccountStrategies.js"

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
