// TODO remove this file
import { webappDirname } from "@workspace/locators"

const { admin } = webappDirname

export const adminDashboardHtmlPathname = `/${admin}/dashboard.html`

export const adminAccountDetailsHtmlPathname = `/${admin}/account-details.html`

export const adminHtmlPathnames = [
	adminDashboardHtmlPathname,
	adminAccountDetailsHtmlPathname
]
