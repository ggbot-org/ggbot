import { AccountStrategies } from "_/components/admin/AccountStrategies"
import { PageContainer } from "_/components/admin/PageContainer"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs"
import { AccountProvider } from "_/contexts/admin/Account"
import { PageName } from "_/routing/pageNames"
import { FC, useState } from "react"

const pageName: PageName = "AdminAccountDetails"

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
