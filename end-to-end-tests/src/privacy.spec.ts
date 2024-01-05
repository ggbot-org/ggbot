import { expect, test } from "@playwright/test"
import { ENV } from "@workspace/env"

import { webapp } from "./webapp.js"

test("has title", async ({ page }) => {
	await page.goto(webapp.privacy.pathname)

	await expect(page).toHaveTitle(new RegExp(ENV.PROJECT_SHORT_NAME()))
})
