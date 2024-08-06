import { I18nProvider } from "_/contexts/I18n"
import { CopyStrategyPage } from "_/pages/user/CopyStrategy"
import { DashboardPage } from "_/pages/user/Dashboard"
import { EditStrategyPage } from "_/pages/user/EditStrategy"
import { PurchaseCanceledPage } from "_/pages/user/PurchaseCanceled"
import { SettingsPage } from "_/pages/user/Settings"
import { StrategyPage } from "_/pages/user/Strategy"
import { SubscriptionPurchasedPage } from "_/pages/user/SubscriptionPurchased"
import { mount } from "_/react/mount"
import { webapp } from "_/routing/webapp"
import { nullStrategyKey } from "@workspace/models"

function Router() {
	const pathname = location.pathname

	if (pathname === webapp.user.dashboard.pathname) return <DashboardPage />

	if (pathname === webapp.user.copyStrategy(nullStrategyKey).pathname) return <CopyStrategyPage />

	if (pathname === webapp.user.editStrategy(nullStrategyKey).pathname) return <EditStrategyPage />

	if (pathname === webapp.user.settings.pathname) return <SettingsPage />

	if (pathname === webapp.user.strategy(nullStrategyKey).pathname) return <StrategyPage />

	if (pathname === webapp.purchaseCanceled.pathname) return <PurchaseCanceledPage />

	if (pathname === webapp.subscriptionPurchased.pathname) return <SubscriptionPurchasedPage />

	return null
}

mount(
	<I18nProvider>
		<Router />
	</I18nProvider>
)
