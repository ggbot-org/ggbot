import { privacyHtmlFilename, termsHtmlFilename } from "./pages.js"

export const pathname = {
	privacyPolicyPage: () => `${privacyHtmlFilename}`,
	termsOfServicePage: () => `/${termsHtmlFilename}`
}
