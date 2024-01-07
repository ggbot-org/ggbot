import { WebappDirname, WebappSettingsPageId } from "@workspace/locators"

export const userDashboardHtmlPathname = `/${WebappDirname.user}/dashboard.html`

export const settingsHtmlPathname = (pageId: WebappSettingsPageId) =>
	`/${WebappDirname.user}/${pageId}-settings.html`
