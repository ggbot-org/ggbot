import { Account } from "_/components/admin/Account"
import { AccountPageContainer } from "_/components/admin/AccountPageContainer"
import { PageContainer } from "_/components/admin/PageContainer"
import { TabId, Tabs } from "_/components/Tabs"
import { useState } from "react"

export function AccountDetailsPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("account")

	return (
		<PageContainer>
			<AccountPageContainer>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "account",
							content: <Account />
						}
					]}
				/>
			</AccountPageContainer>
		</PageContainer>
	)
}
