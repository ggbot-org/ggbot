import { expect, test } from '@playwright/test'
import { AuthClientActionOutput } from '@workspace/api'

import { api, webapp } from './locators.js'
import { testEmail1, testOneTimePasswordCode } from './test-data.js'

test('launch app', async ({ page }) => {
	await page.goto('/')

	await page.getByRole('button', { name: 'Launch App' }).click()

	await expect(page).toHaveURL(webapp.user.dashboard.toString())

	await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
	await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible()

	await page.getByRole('textbox').fill(testEmail1)
	await page.getByRole('checkbox').check()
	await page.getByRole('button').click()

	const enterResponse = await page.waitForResponse(api.auth.toString())
	expect(enterResponse.status()).toBe(200)
	const enterResponseOutput: AuthClientActionOutput['Enter'] = { emailSent: true }
	expect(enterResponse.json()).toBe({ data: enterResponseOutput })

	await page.getByRole('textbox').fill(testOneTimePasswordCode)
	await page.getByRole('button').click()
})
