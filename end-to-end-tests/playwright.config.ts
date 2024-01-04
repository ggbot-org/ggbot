import { defineConfig, devices } from "@playwright/test"
import { ENV } from "@workspace/env"
import { FQDN, WebappBaseURL } from "@workspace/locators"

const fqdn = new FQDN("next", ENV.DNS_DOMAIN())
const baseURL = new WebappBaseURL(fqdn).toString()

/** @see {@link https://playwright.dev/docs/test-configuration} */
// ts-prune-ignore-next
export default defineConfig({
	fullyParallel: true,
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] }
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] }
		}
	],
	reporter: "html",
	testDir: "./src",
	use: { baseURL }
})
