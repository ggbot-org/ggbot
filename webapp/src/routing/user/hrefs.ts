import { adminDashboardHtmlPathname } from "_/routing/admin/pages"
import {
	settingsHtmlPathname,
	userDashboardHtmlPathname
} from "_/routing/user/pages"
import { WebappSettingsPageId as SettingsPageId } from "@workspace/locators"

export const href = {
	adminPage: () => adminDashboardHtmlPathname,
	dashboardPage: () => userDashboardHtmlPathname,
	settingsPage: (id: SettingsPageId) => settingsHtmlPathname(id)
}
