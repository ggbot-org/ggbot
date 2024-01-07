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
	settingsHtmlPathname,
	strategyHtmlPathname,
	userDashboardHtmlPathname
} from "_/routing/user/pages"
import { WebappPagePathname } from "@workspace/locators"
import { FC } from "react"

const Router: FC = () => {
	const pathname = window.location.pathname

	if (pathname === userDashboardHtmlPathname) return <DashboardPage />

	if (pathname === copyStrategyHtmlPathname) return <CopyStrategyPage />

	if (pathname === strategyHtmlPathname) return <StrategyPage />

	if (pathname === settingsHtmlPathname("account"))
		return <AccountSettingsPage />

	if (pathname === settingsHtmlPathname("billing"))
		return <BillingSettingsPage />

	if (pathname === settingsHtmlPathname("binance"))
		return <BinanceSettingsPage />

	if (pathname === WebappPagePathname.purchaseCanceled)
		return <PurchaseCanceledPage />

	if (pathname === WebappPagePathname.subscriptionPurchased)
		return <SubscriptionPurchasedPage />

	return null
}

mount(Router)
