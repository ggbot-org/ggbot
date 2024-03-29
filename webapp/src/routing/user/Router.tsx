import { CopyStrategyPage } from "_/pages/user/CopyStrategy"
import { DashboardPage } from "_/pages/user/Dashboard"
import { EditStrategyPage } from "_/pages/user/EditStrategy"
import { PurchaseCanceledPage } from "_/pages/user/PurchaseCanceled"
import { SettingsPage } from "_/pages/user/Settings"
import { StrategyPage } from "_/pages/user/Strategy"
import { SubscriptionPurchasedPage } from "_/pages/user/SubscriptionPurchased"
import { mount } from "_/react/mount"
import { webapp } from "_/routing/webapp"
import { webappPagePathname } from "@workspace/locators"
import { nullStrategyKey } from "@workspace/models"
import { FC } from "react"

const Router: FC = () => {
	const pathname = globalThis.location.pathname

	if (pathname === webapp.user.dashboard.pathname) return <DashboardPage />

	if (pathname === webapp.user.copyStrategy(nullStrategyKey).pathname)
		return <CopyStrategyPage />

	if (pathname === webapp.user.editStrategy(nullStrategyKey).pathname)
		return <EditStrategyPage />

	if (pathname === webapp.user.settings.pathname) return <SettingsPage />

	if (pathname === webapp.user.strategy(nullStrategyKey).pathname)
		return <StrategyPage />

	if (pathname === webappPagePathname.purchaseCanceled)
		return <PurchaseCanceledPage />

	if (pathname === webappPagePathname.subscriptionPurchased)
		return <SubscriptionPurchasedPage />

	return null
}

mount(Router)
