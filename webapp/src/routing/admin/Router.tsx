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

	switch (true) {
		case pathname === adminDashboardHtmlPathname:
			return <DashboardPage />

		case pathname === adminAccountDetailsHtmlPathname:
			return <AccountDetailsPage />

		default:
			return null
	}
}

mount(Router)
