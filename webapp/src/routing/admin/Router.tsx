import { AccountDetailsPage } from "_/pages/admin/AccountDetails"
import { DashboardPage } from "_/pages/admin/Dashboard"
import { mount } from "_/react/mount"
import {
	adminAccountDetailsHtmlPathname,
	adminDashboardHtmlPathname
} from "_/routing/admin/pages"
import { FC } from "react"

const Router: FC = () => {
	const pathname = window.location.pathname

	if (pathname === adminDashboardHtmlPathname) return <DashboardPage />

	if (pathname === adminAccountDetailsHtmlPathname)
		return <AccountDetailsPage />

	return null
}

mount(Router)
