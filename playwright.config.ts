import { defineConfig, devices } from '@playwright/test'
import { ENV } from '@workspace/env'
import { FQDN, WebappBaseURL } from '@workspace/locators'

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
const baseURL = new WebappBaseURL(new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())).toString()

export default defineConfig({
	forbidOnly: true, // Fail the build if there are `test.only` in the source code.
	fullyParallel: true,
	outputDir: './playwright-output',
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile', use: { ...devices['iPhone 12'] } },
	],
	reporter: 'html',
	testDir: './playwright-tests/src/',
	use: {
		baseURL, // Base URL to use in actions like `await page.goto('/')`.
	},
	// Run local dev server before starting the tests.
	webServer: DEPLOY_STAGE == 'local' ? {
		command: 'npm start',
		url: baseURL,
		reuseExistingServer: true,
	} : undefined,
})
