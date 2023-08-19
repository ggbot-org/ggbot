import { mount } from "@ggbot2/react"
import { FC } from "react"

import { AccountDetailsPage } from "../../pages/admin/AccountDetails.js"
import { DashboardPage } from "../../pages/admin/Dashboard.js"
import {
	adminAccountDetailsHtmlPathname,
	adminDashboardHtmlPathname,
	adminDirname
} from "../../routing/admin/pages.js"

const Router: FC = () => {
	const pathname = window.location.pathname

	switch (true) {
		case pathname === `/${adminDirname}/`:
		case pathname === `/${adminDashboardHtmlPathname}`:
			return <DashboardPage />

		case pathname === `/${adminAccountDetailsHtmlPathname}`:
			return <AccountDetailsPage />

		default:
			return null
	}
}

mount(Router)
