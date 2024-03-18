import { TabId, Tabs } from "_/components/Tabs"
import { AccountSettings } from "_/components/user/AccountSettings"
import { BillingSettings } from "_/components/user/BillingSettings"
import { BinanceSettings } from "_/components/user/BinanceSettings"
import { PageContainer } from "_/components/user/PageContainer"
import { FC, useState } from "react"

export const SettingsPage: FC = () => {
	const [activeTabId, setActiveTabId] = useState<TabId>("account")

	return (
		<PageContainer>
			<Tabs
				activeTabId={activeTabId}
				setActiveTabId={setActiveTabId}
				tabs={[
					{
						tabId: "account",
						content: <AccountSettings />
					},
					{
						tabId: "billing",
						content: <BillingSettings />
					},
					{
						tabId: "binance",
						content: <BinanceSettings />
					}
				]}
			/>
		</PageContainer>
	)
}
