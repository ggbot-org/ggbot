import { mount } from "@ggbot2/react"
import { FC } from "react"

import { HomePage } from "../../pages/HomePage.js"
import { PrivacyPage } from "../../pages/Privacy.js"
import { TermsPage } from "../../pages/Terms.js"
import { homepageHtmlPathname, privacyHtmlPathname, termsHtmlPathname}from "./pages.js"

const Router: FC = () => {
	const pathname = window.location.pathname

	switch (true) {
		case pathname === "/":
		case pathname === homepageHtmlPathname:
			return <HomePage />

		case pathname === termsHtmlPathname:
			return <TermsPage />

		case pathname === privacyHtmlPathname:
			return <PrivacyPage />

		default:
			return null
	}
}

mount(Router)

