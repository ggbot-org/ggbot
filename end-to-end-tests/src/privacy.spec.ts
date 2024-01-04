import { expect, test } from "@playwright/test"

test("has title", async ({ page }) => {
	await page.goto("/privacy.html")
	await expect(page).toHaveTitle(/ggbot/)
})
