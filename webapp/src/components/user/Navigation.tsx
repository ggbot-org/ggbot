import { classNames } from "_/classNames"
import {
	Navbar,
	NavbarDropdown,
	NavbarEnd,
	NavbarItem,
	NavbarItemAnchor,
	NavbarLink,
	NavbarStart
} from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { href } from "_/routing/user/hrefs"
import { SettingsPageId } from "_/routing/user/types"
import { isAdminAccount } from "@workspace/models"
import { memo, useCallback, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const Navigation = memo(() => {
	const { account, showAuthExit } = useContext(AuthenticationContext)

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
				{isAdminAccount(account) ? (
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
