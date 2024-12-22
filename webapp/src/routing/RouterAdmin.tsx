import { I18nProvider } from '_/contexts/I18n'
import { ToastProvider } from '_/contexts/Toast'
import { AccountDetailsPage } from '_/pages/admin/AccountDetails'
import { DashboardPage } from '_/pages/admin/Dashboard'
import { mount } from '_/react/mount'
import { webappPagePathname } from '@workspace/locators'

function Router() {
	const pathname = location.pathname

	if (pathname === webappPagePathname.admin.dashboard) return <DashboardPage />

	if (pathname === webappPagePathname.admin.accountDetails) return <AccountDetailsPage />

	return null
}

mount(
	<I18nProvider>
		<ToastProvider>
			<Router />
		</ToastProvider>
	</I18nProvider>
)
