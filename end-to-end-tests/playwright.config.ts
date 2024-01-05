import { defineConfig, devices } from "@playwright/test"

import { webapp } from "./src/webapp.js"

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
	use: { baseURL: webapp.baseURL.toString() }
})
