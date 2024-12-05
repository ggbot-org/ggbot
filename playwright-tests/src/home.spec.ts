import { expect, test } from '@playwright/test'
import { ENV } from '@workspace/env'

const PROJECT_SHORT_NAME = ENV.PROJECT_SHORT_NAME()

test('has title', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(PROJECT_SHORT_NAME)
})
