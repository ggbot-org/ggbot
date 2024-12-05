import { expect, test } from '@playwright/test'

test('Launch App', async ({ page }) => {
	await page.goto('/')

	await page.getByRole('button', { name: 'Launch App' }).click()

	await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
	await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible()
})
