import { classNames } from "_/classNames"
import {
	Navbar,
	NavbarEnd,
	NavbarItemAnchor,
	NavbarStart
} from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { useStoredAccount } from "_/hooks/useStoredAccount"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { isAdminAccount } from "@workspace/models"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const Navigation: FC = () => {
	const { showAuthExit } = useContext(AuthenticationContext)
	const account = useStoredAccount()

	return (
		<Navbar className="Navigation">
			<NavbarStart>
				<NavbarItemAnchor
					onClick={() => {
						GOTO(webapp.user.dashboard)
					}}
				>
					<FormattedMessage id="Navigation.dashboard" />
				</NavbarItemAnchor>

				<NavbarItemAnchor
					onClick={() => {
						GOTO(webapp.user.settings)
					}}
				>
					<FormattedMessage id="Navigation.settings" />
				</NavbarItemAnchor>
			</NavbarStart>

			<NavbarEnd>
				{isAdminAccount(account) ? (
					<NavbarItemAnchor
						className={classNames("has-text-primary")}
						onClick={() => {
							GOTO(webapp.admin.dashboard)
						}}
					>
						<FormattedMessage id="Navigation.admin" />
					</NavbarItemAnchor>
				) : null}

				<NavbarItemAnchor
					onClick={() => {
						showAuthExit()
					}}
				>
					<FormattedMessage id="Navigation.exit" />
				</NavbarItemAnchor>
			</NavbarEnd>
		</Navbar>
	)
}
