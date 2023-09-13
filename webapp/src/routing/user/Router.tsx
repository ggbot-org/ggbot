import { AccountSettingsPage } from "_/pages/user/AccountSettings"
import { BillingSettingsPage } from "_/pages/user/BillingSettings"
import { BinanceSettingsPage } from "_/pages/user/BinanceSettings"
import { CopyStrategyPage } from "_/pages/user/CopyStrategy"
import { DashboardPage } from "_/pages/user/Dashboard"
import { PurchaseCanceledPage } from "_/pages/user/PurchaseCanceled"
import { StrategyPage } from "_/pages/user/Strategy"
import { SubscriptionPurchasedPage } from "_/pages/user/SubscriptionPurchased"
import { mount } from "_/react/mount"
import {
	copyStrategyHtmlPathname,
	purchaseCanceledHtmlPathname,
	settingsHtmlPathname,
	strategyHtmlPathname,
	subscriptionPurchasedHtmlPathname,
	userDashboardHtmlPathname
} from "_/routing/user/pages"
import { FC } from "react"

const Router: FC = () => {
	const pathname = window.location.pathname

	switch (true) {
		case pathname === userDashboardHtmlPathname:
			return <DashboardPage />

		case pathname === copyStrategyHtmlPathname:
			return <CopyStrategyPage />

		case pathname === strategyHtmlPathname:
			return <StrategyPage />

		case pathname === settingsHtmlPathname("account"):
			return <AccountSettingsPage />

		case pathname === settingsHtmlPathname("billing"):
			return <BillingSettingsPage />

		case pathname === settingsHtmlPathname("binance"):
			return <BinanceSettingsPage />

		case pathname === purchaseCanceledHtmlPathname:
			return <PurchaseCanceledPage />

		case pathname === subscriptionPurchasedHtmlPathname:
			return <SubscriptionPurchasedPage />

		default:
			return null
	}
}

mount(Router)
