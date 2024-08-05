import { Accounts } from "_/components/admin/Accounts"
import { PageContainer } from "_/components/admin/PageContainer"
import { TabId, Tabs } from "_/components/Tabs"
import { useState } from "react"

export function DashboardPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("accounts")
	return (
		<PageContainer>
			<Tabs
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
