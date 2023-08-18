import { mount } from "@ggbot2/react"
import { FC } from "react"

import { AccountDetailsPage } from "../pages/AccountDetails.js"
import { DashboardPage } from "../pages/Dashboard.js"
import {
	adminAccountDetailsHtmlPathname,
	adminDashboardHtmlPathname,
	adminDirname
} from "../routing/pages.js"

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
