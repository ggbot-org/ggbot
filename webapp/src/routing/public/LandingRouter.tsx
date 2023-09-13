import { mount } from "_/react/mount"
import { FC } from "react"

import { HomePage } from "../../pages/HomePage"
import { PrivacyPage } from "../../pages/Privacy"
import { TermsPage } from "../../pages/Terms"
import { homepageHtmlPathname, privacyHtmlPathname, termsHtmlPathname}from "./pages"

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

