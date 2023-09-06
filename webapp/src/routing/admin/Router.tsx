import { AccountDetailsPage } from "_/pages/admin/AccountDetails.js"
import { DashboardPage } from "_/pages/admin/Dashboard.js"
import { mount } from "_/react/mount"
import {
	adminAccountDetailsHtmlPathname,
	adminDashboardHtmlPathname
} from "_/routing/admin/pages.js"
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
