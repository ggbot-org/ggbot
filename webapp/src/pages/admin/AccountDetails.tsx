import { AccountStrategies } from "_/components/admin/AccountStrategies.js"
import { PageContainer } from "_/components/admin/PageContainer.js"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs.js"
import { AccountProvider } from "_/contexts/admin/Account.js"
import { FC, useState } from "react"

const pageName = "AdminAccountDetails"

export const AccountDetailsPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "strategies"
	)

	return (
		<PageContainer>
			<AccountProvider>
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
			</AccountProvider>
		</PageContainer>
	)
}
