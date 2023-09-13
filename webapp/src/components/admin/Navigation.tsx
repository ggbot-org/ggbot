import { Navbar, NavbarItemAnchor, NavbarStart } from "_/components/library"
import { href } from "_/routing/admin/hrefs"
import { memo } from "react"
import { FormattedMessage } from "react-intl"

export const Navigation = memo(() => {
	const goToAccountsPage = () => {
		if (window.location.href !== href.accountsPage())
			window.location.href = href.accountsPage()
	}

	return (
		<Navbar>
			<NavbarStart>
				<NavbarItemAnchor onClick={goToAccountsPage}>
					<FormattedMessage id="AdminNavigation.dashboard" />
				</NavbarItemAnchor>
			</NavbarStart>
		</Navbar>
	)
})

Navigation.displayName = "AdminNavigation"
