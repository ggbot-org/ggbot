import { I18nProvider } from '_/contexts/I18n'
import { ToastProvider } from '_/contexts/Toast'
import { CopyStrategyPage } from '_/pages/user/CopyStrategy'
import { DashboardPage } from '_/pages/user/Dashboard'
import { EditStrategyPage } from '_/pages/user/EditStrategy'
import { PurchaseCanceledPage } from '_/pages/user/PurchaseCanceled'
import { SettingsPage } from '_/pages/user/Settings'
import { StrategyPage } from '_/pages/user/Strategy'
import { SubscriptionPurchasedPage } from '_/pages/user/SubscriptionPurchased'
import { mount } from '_/react/mount'
import { webappPagePathname } from '@workspace/locators'

function Router() {
	const pathname = location.pathname

	if (pathname === webappPagePathname.user.dashboard) return <DashboardPage />

	if (pathname === webappPagePathname.user.copyStrategy) return <CopyStrategyPage />

	if (pathname === webappPagePathname.user.editStrategy) return <EditStrategyPage />

	if (pathname === webappPagePathname.user.settings) return <SettingsPage />

	if (pathname === webappPagePathname.user.strategy) return <StrategyPage />

	if (pathname === webappPagePathname.purchaseCanceled) return <PurchaseCanceledPage />

	if (pathname === webappPagePathname.subscriptionPurchased) return <SubscriptionPurchasedPage />

	return null
}

mount(
	<I18nProvider>
		<ToastProvider>
			<Router />
		</ToastProvider>
	</I18nProvider>
)
