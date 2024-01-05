import { adminDashboardHtmlPathname } from "_/routing/admin/pages"
import {
	settingsHtmlPathname,
	userDashboardHtmlPathname
} from "_/routing/user/pages"
import { SettingsPageId } from "_/routing/user/types"

export const href = {
	adminPage: () => adminDashboardHtmlPathname,
	dashboardPage: () => userDashboardHtmlPathname,
	settingsPage: (id: SettingsPageId) => settingsHtmlPathname(id)
}
