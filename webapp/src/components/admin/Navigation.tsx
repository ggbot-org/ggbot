import { Navbar, NavbarLink, NavbarStart } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'

export function Navigation() {
	return (
		<Navbar>
			<NavbarStart>
				<NavbarLink onClick={() => GOTO(webapp.admin.dashboard)}>
					<FormattedMessage id="AdminNavigation.dashboard" />
				</NavbarLink>
			</NavbarStart>
		</Navbar>
	)
}
