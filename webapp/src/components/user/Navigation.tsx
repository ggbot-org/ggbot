import { classnames } from "_/classnames"
import {
	Navbar,
	NavbarEnd,
	NavbarLink,
	NavbarStart
} from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { useContext } from "react"
import { FormattedMessage } from "react-intl"

export function Navigation() {
	const { accountIsAdmin, showAuthExit } = useContext(AuthenticationContext)

	return (
		<Navbar className={classnames("navigation")}>
			<NavbarStart>
				<NavbarLink
					className="is-arrowless"
					onClick={() => {
						GOTO(webapp.user.dashboard)
					}}
				>
					<FormattedMessage id="Navigation.dashboard" />
				</NavbarLink>

				<NavbarLink
					onClick={() => {
						GOTO(webapp.user.settings)
					}}
				>
					<FormattedMessage id="Navigation.settings" />
				</NavbarLink>
			</NavbarStart>

			<NavbarEnd>
				{accountIsAdmin ? (
					<NavbarLink
						className={classnames("has-text-primary")}
						onClick={() => {
							GOTO(webapp.admin.dashboard)
						}}
					>
						<FormattedMessage id="Navigation.admin" />
					</NavbarLink>
				) : null}

				<NavbarLink
					onClick={() => {
						showAuthExit()
					}}
				>
					<FormattedMessage id="Navigation.exit" />
				</NavbarLink>
			</NavbarEnd>
		</Navbar>
	)
}
