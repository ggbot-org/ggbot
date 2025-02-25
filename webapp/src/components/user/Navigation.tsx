import { Classname } from '_/classnames'
import {
	Navbar,
	NavbarEnd,
	NavbarLink,
	NavbarStart,
} from '_/components/library'
import { AuthenticationContext } from '_/contexts/Authentication'
import { FormattedMessage } from '_/i18n/components'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { useContext } from 'react'

export function Navigation() {
	const { accountIsAdmin, showAuthExit } = useContext(AuthenticationContext)

	return (
		<Navbar>
			<NavbarStart>
				<NavbarLink onClick={() => GOTO(webapp.user.dashboard)}>
					<FormattedMessage id="Navigation.dashboard" />
				</NavbarLink>
				<NavbarLink onClick={() => GOTO(webapp.user.settings)}>
					<FormattedMessage id="Navigation.settings" />
				</NavbarLink>
			</NavbarStart>
			<NavbarEnd>
				{accountIsAdmin ? (
					<NavbarLink
						className={'has-text-primary' satisfies Classname}
						onClick={() => GOTO(webapp.admin.dashboard)}
					>
						<FormattedMessage id="Navigation.admin" />
					</NavbarLink>
				) : null}
				<NavbarLink onClick={() => showAuthExit()}>
					<FormattedMessage id="Navigation.exit" />
				</NavbarLink>
			</NavbarEnd>
		</Navbar>
	)
}
