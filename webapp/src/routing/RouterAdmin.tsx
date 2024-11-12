import { I18nProvider } from '_/contexts/I18n'
import { ToastProvider } from '_/contexts/Toast'
import { AccountDetailsPage } from '_/pages/admin/AccountDetails'
import { DashboardPage } from '_/pages/admin/Dashboard'
import { mount } from '_/react/mount'
import { webapp } from '_/routing/webapp'
import { nullAccountKey } from '@workspace/models'

function Router() {
	const pathname = location.pathname

	if (pathname === webapp.admin.dashboard.pathname) return <DashboardPage />

	if (pathname === webapp.admin.accountDetails(nullAccountKey).pathname) return <AccountDetailsPage />

	return null
}

mount(
	<I18nProvider>
		<ToastProvider>
			<Router />
		</ToastProvider>
	</I18nProvider>
)
