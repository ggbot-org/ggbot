import { accountKeyToURLSearchParams } from "_/routing/admin/accountKeyParams.js"
import {
	adminAccountDetailsHtmlPathname,
	adminDashboardHtmlPathname
} from "_/routing/admin/pages.js"
import { AccountKey } from "@workspace/models"

export const href = {
	dashboardPage: () => `/${adminDashboardHtmlPathname}`,
	accountDetailsPage: (accountKey: AccountKey) => {
		const searchParams = accountKeyToURLSearchParams(accountKey).toString()
		return `/${adminAccountDetailsHtmlPathname}?${searchParams}`
	}
}
