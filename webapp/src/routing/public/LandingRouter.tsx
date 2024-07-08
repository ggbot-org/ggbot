import { HomePage } from "_/pages/HomePage"
import { PrivacyPage } from "_/pages/Privacy"
import { TermsPage } from "_/pages/Terms"
import { mount } from "_/react/mount"
import { webapp } from "_/routing/webapp"
import { FC } from "react"

const Router: FC = () => {
	const { pathname } = location

	if (pathname === "/" || pathname === webapp.homepage.pathname)
		return <HomePage />

	if (pathname === webapp.privacy.pathname) return <PrivacyPage />

	if (pathname === webapp.terms.pathname) return <TermsPage />

	return null
}

mount(Router)
