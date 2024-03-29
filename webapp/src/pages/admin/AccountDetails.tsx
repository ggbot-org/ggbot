import { Account } from "_/components/admin/Account"
import { PageContainer } from "_/components/admin/PageContainer"
import { TabId, Tabs } from "_/components/Tabs"
import { AccountProvider } from "_/contexts/admin/Account"
import { FC, useState } from "react"

export const AccountDetailsPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>("account")

	return (
		<PageContainer>
			<AccountProvider>
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
			</AccountProvider>
		</PageContainer>
	)
}
