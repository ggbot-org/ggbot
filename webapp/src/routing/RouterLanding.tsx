import { I18nProvider } from '_/contexts/I18n'
import { Homepage } from '_/pages/public/Homepage'
import { PrivacyPage } from '_/pages/public/Privacy'
import { TermsPage } from '_/pages/public/Terms'
import { mount } from '_/react/mount'
import { webapp } from '_/routing/webapp'

function Router() {
	const { pathname } = location

	if (pathname === '/' || pathname === webapp.homepage.pathname) return <Homepage />

	if (pathname === webapp.privacy.pathname) return <PrivacyPage />

	if (pathname === webapp.terms.pathname) return <TermsPage />

	return null
}

mount(
	<I18nProvider>
		<Router />
	</I18nProvider>
)
