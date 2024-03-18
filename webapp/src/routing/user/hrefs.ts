// TODO remove this file??
import { adminDashboardHtmlPathname } from "_/routing/admin/pages"
import {
	settingsHtmlPathname,
	userDashboardHtmlPathname
} from "_/routing/user/pages"

export const href = {
	adminPage: () => adminDashboardHtmlPathname,
	dashboardPage: () => userDashboardHtmlPathname,
	settingsPage: () => settingsHtmlPathname
}
