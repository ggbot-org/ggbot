import {
	Navbar,
	NavbarDropdown,
	NavbarEnd,
	NavbarItem,
	NavbarItemAnchor,
	NavbarLink,
	NavbarStart
} from "@ggbot2/design"
import { memo, useCallback, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { AuthenticationContext } from "../../contexts/Authentication.js"
import { href } from "../../routing/user/hrefs.js"
import { SettingsPageId } from "../../routing/user/types.js"
import { classNames } from "../../styles/classNames.js"

export const Navigation = memo(() => {
	const { account, showAuthExit } = useContext(AuthenticationContext)

	const isAdmin = account.role === "admin"

	const goToAdminPage = () => {
		if (window.location.href !== href.adminPage())
			window.location.href = href.adminPage()
	}

	const goToDashboardPage = () => {
		if (window.location.href !== href.dashboardPage())
			window.location.href = href.dashboardPage()
	}

	const onClickExit = useCallback(() => {
		showAuthExit()
	}, [showAuthExit])

	const goToSettings = useCallback(
		(settingsPage: SettingsPageId) => () => {
			window.location.href = href.settingsPage(settingsPage)
		},
		[]
	)

	return (
		<Navbar>
			<NavbarStart>
				<NavbarItemAnchor onClick={goToDashboardPage}>
					<FormattedMessage id="Navigation.dashboard" />
				</NavbarItemAnchor>

				<NavbarItem hasDropdown isHoverable>
					<NavbarLink>
						<FormattedMessage id="Navigation.settings" />
					</NavbarLink>

					<NavbarDropdown>
						<NavbarItemAnchor onClick={goToSettings("account")}>
							<FormattedMessage id="Navigation.account" />
						</NavbarItemAnchor>

						<NavbarItemAnchor onClick={goToSettings("binance")}>
							<FormattedMessage id="Navigation.binance" />
						</NavbarItemAnchor>

						<NavbarItemAnchor onClick={goToSettings("billing")}>
							<FormattedMessage id="Navigation.billing" />
						</NavbarItemAnchor>
					</NavbarDropdown>
				</NavbarItem>
			</NavbarStart>

			<NavbarEnd>
				{isAdmin ? (
					<NavbarItemAnchor
						className={classNames("has-text-primary")}
						onClick={goToAdminPage}
					>
						<FormattedMessage id="Navigation.admin" />
					</NavbarItemAnchor>
				) : null}

				<NavbarItemAnchor onClick={onClickExit}>
					<FormattedMessage id="Navigation.exit" />
				</NavbarItemAnchor>
			</NavbarEnd>
		</Navbar>
	)
})

Navigation.displayName = "Navigation"