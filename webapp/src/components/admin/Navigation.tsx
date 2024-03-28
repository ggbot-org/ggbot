import { Navbar, NavbarItemAnchor, NavbarStart } from "_/components/library"
import { webapp } from "_/routing/webapp"
import { memo } from "react"
import { FormattedMessage } from "react-intl"

export const Navigation = memo(() => (
	<Navbar className="Navigation">
		<NavbarStart>
			<NavbarItemAnchor
				onClick={() => {
					const pathname = webapp.admin.dashboard.pathname
					if (location.pathname !== pathname)
						location.pathname = pathname
				}}
			>
				<FormattedMessage id="AdminNavigation.dashboard" />
			</NavbarItemAnchor>
		</NavbarStart>
	</Navbar>
))

Navigation.displayName = "AdminNavigation"
