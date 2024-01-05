import { mount } from "_/react/mount"
import { webapp } from "_/routing/webapp"
import { FC } from "react"

import { HomePage } from "../../pages/HomePage"
import { PrivacyPage } from "../../pages/Privacy"
import { TermsPage } from "../../pages/Terms"

const Router: FC = () => {
	const pathname = window.location.pathname

if (pathname==="/"||pathname==="webapp.homepage.pathname")
			return <HomePage />

if (pathname===webapp.privacy.pathname)
			return <PrivacyPage />

if (pathname===webapp.terms.pathname)
			return <TermsPage />

return null
}

mount(Router)

