import { classNames } from "_/classNames"
import {
	Navbar,
	NavbarEnd,
	NavbarItemAnchor,
	NavbarStart
} from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { href } from "_/routing/user/hrefs"
import { memo, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const Navigation = memo(() => {
	const { accountIsAdmin, showAuthExit } = useContext(AuthenticationContext)

	return (
		<Navbar>
			<NavbarStart>
				<NavbarItemAnchor
					onClick={() => {
						if (window.location.href !== href.dashboardPage())
							window.location.href = href.dashboardPage()
					}}
				>
					<FormattedMessage id="Navigation.dashboard" />
				</NavbarItemAnchor>

				<NavbarItemAnchor
					onClick={() => {
						if (window.location.href !== href.settingsPage())
							window.location.href = href.settingsPage()
					}}
				>
					<FormattedMessage id="Navigation.settings" />
				</NavbarItemAnchor>
			</NavbarStart>

			<NavbarEnd>
				{accountIsAdmin ? (
					<NavbarItemAnchor
						className={classNames("has-text-primary")}
						onClick={() => {
							if (window.location.href !== href.adminPage())
								window.location.href = href.adminPage()
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
})

Navigation.displayName = "Navigation"
