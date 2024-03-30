import { Navbar, NavbarItemAnchor, NavbarStart } from "_/components/library"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const Navigation: FC = () => (
	<Navbar className="Navigation">
		<NavbarStart>
			<NavbarItemAnchor
				onClick={() => {
					GOTO(webapp.admin.dashboard)
				}}
			>
				<FormattedMessage id="AdminNavigation.dashboard" />
			</NavbarItemAnchor>
		</NavbarStart>
	</Navbar>
)
