import { AccountKey } from "@ggbot2/models"

import { accountKeyToURLSearchParams } from "./accountKeyParams.js"
import {
	adminAccountDetailsHtmlPathname,
	adminDashboardHtmlPathname
} from "./pages.js"

export const href = {
	dashboardPage: () => `/${adminDashboardHtmlPathname}`,
	accountDetailsPage: (accountKey: AccountKey) => {
		const searchParams = accountKeyToURLSearchParams(accountKey).toString()
		return `/${adminAccountDetailsHtmlPathname}?${searchParams}`
	}
}
