import { mount } from "@ggbot2/react"
import { FC } from "react"

import { HomePage } from "../../pages/HomePage.js"
import { PrivacyPage } from "../../pages/Privacy.js"
import { TermsPage } from "../../pages/Terms.js"
import { homepageHtmlFilename, privacyHtmlFilename, termsHtmlFilename}from "./pages.js"

const Router: FC = () => {
	const pathname = window.location.pathname

	switch (true) {
		case pathname === "/":
		case pathname === `/${homepageHtmlFilename}`:
			return <HomePage />

		case pathname === `/${termsHtmlFilename}`:
			return <TermsPage />

		case pathname === `/${privacyHtmlFilename}`:
			return <PrivacyPage />

		default:
			return null
	}
}

mount(Router)

