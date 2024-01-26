import { webappDirname, WebappSettingsPageId } from "@workspace/locators"

const { user } = webappDirname

export const userDashboardHtmlPathname = `/${user}/dashboard.html`

export const settingsHtmlPathname = (pageId: WebappSettingsPageId) =>
	`/${user}/${pageId}-settings.html`
