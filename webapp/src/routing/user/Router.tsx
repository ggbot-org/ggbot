import { AccountSettingsPage } from "_/pages/user/AccountSettings"
import { BillingSettingsPage } from "_/pages/user/BillingSettings"
import { BinanceSettingsPage } from "_/pages/user/BinanceSettings"
import { CopyStrategyPage } from "_/pages/user/CopyStrategy"
import { DashboardPage } from "_/pages/user/Dashboard"
import { PurchaseCanceledPage } from "_/pages/user/PurchaseCanceled"
import { StrategyPage } from "_/pages/user/Strategy"
import { SubscriptionPurchasedPage } from "_/pages/user/SubscriptionPurchased"
import { mount } from "_/react/mount"
import { settingsHtmlPathname } from "_/routing/user/pages"
import { webapp } from "_/routing/webapp"
import { webappPagePathname } from "@workspace/locators"
import { nullStrategyKey } from "@workspace/models"
import { FC } from "react"

const Router: FC = () => {
	const pathname = globalThis.location.pathname

	if (pathname === webapp.user.dashboard.pathname) return <DashboardPage />

	if (pathname === webapp.user.copyStrategy(nullStrategyKey).pathname)
		return <CopyStrategyPage />

	if (pathname === webapp.user.strategy(nullStrategyKey).pathname)
		return <StrategyPage />

	if (pathname === settingsHtmlPathname("account"))
		return <AccountSettingsPage />

	if (pathname === settingsHtmlPathname("billing"))
		return <BillingSettingsPage />

	if (pathname === settingsHtmlPathname("binance"))
		return <BinanceSettingsPage />

	if (pathname === webappPagePathname.purchaseCanceled)
		return <PurchaseCanceledPage />

	if (pathname === webappPagePathname.subscriptionPurchased)
		return <SubscriptionPurchasedPage />

	return null
}

mount(Router)
