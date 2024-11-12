import { Navbar, NavbarLink, NavbarStart } from '_/components/library'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { FormattedMessage } from 'react-intl'

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
