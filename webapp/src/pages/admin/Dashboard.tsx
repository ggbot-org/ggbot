import { Accounts } from "_/components/admin/Accounts"
import { PageContainer } from "_/components/admin/PageContainer"
import { TabId, Tabs } from "_/components/Tabs"
import { FC, useState } from "react"

export const DashboardPage: FC = () => {
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
