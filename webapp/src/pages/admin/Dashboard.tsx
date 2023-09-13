import { Accounts } from "_/components/admin/Accounts"
import { PageContainer } from "_/components/admin/PageContainer"
import { getStoredTabId, TabId, Tabs } from "_/components/Tabs"
import { FC, useState } from "react"

const pageName = "AdminDashboard"

export const DashboardPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>(
		getStoredTabId(pageName) ?? "accounts"
	)

	return (
		<PageContainer>
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
		</PageContainer>
	)
}
