import { TabId, Tabs } from '_/components/Tabs'
import { AccountSettings } from '_/components/user/AccountSettings'
import { BillingSettings } from '_/components/user/BillingSettings'
import { BinanceSettings } from '_/components/user/BinanceSettings'
import { PageContainer } from '_/components/user/PageContainer'
import { useState } from 'react'

export function SettingsPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>('account')

	return (
		<PageContainer>
			<Tabs
				activeTabId={activeTabId}
				setActiveTabId={setActiveTabId}
				tabs={[
					{
						tabId: 'account',
						content: <AccountSettings />,
					},
					{
						tabId: 'billing',
						// Do not render content if tab is not active, avoid unnecessary network calls.
						content: activeTabId === 'billing' ? <BillingSettings /> : null,
					},
					{
						tabId: 'binance',
						// Do not render content if tab is not active, avoid unnecessary network calls.
						content: activeTabId === 'binance' ? <BinanceSettings /> : null,
					},
				]}
			/>
		</PageContainer>
	)
}
