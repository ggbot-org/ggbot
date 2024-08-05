import { AccountDetailsPage } from "_/pages/admin/AccountDetails"
import { DashboardPage } from "_/pages/admin/Dashboard"
import { mount } from "_/react/mount"
import { adminAccountDetailsHtmlPathname, adminDashboardHtmlPathname } from "_/routing/admin/pages"

function Router() {
	const pathname = location.pathname

	if (pathname === adminDashboardHtmlPathname) return <DashboardPage />

	if (pathname === adminAccountDetailsHtmlPathname) return <AccountDetailsPage />

	return null
}

mount(<Router />)
