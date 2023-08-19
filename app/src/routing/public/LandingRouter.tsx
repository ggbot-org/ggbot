import { mount } from "@ggbot2/react"
import { FC } from "react"

import {
HomePage
} from "../../pages/HomePage"
import {
PrivacyPage
} from "../../pages/Privacy"
import {
homepageHtmlFilename,
privacyHtmlFilename}from "./pages"

const Router: FC = () => {
	const pathname = window.location.pathname

	switch (true) {
		case pathname === "/":
		case pathname === `/${homepageHtmlFilename}`:
			return <HomePage />

		case pathname === `/${privacyHtmlFilename}`:
			return <PrivacyPage />

		default:
			return null
	}
}

mount(Router)

