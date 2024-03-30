import { Button } from "_/components/library"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const GoSettings: FC = () => (
	<Button
		onClick={() => {
			GOTO(webapp.user.settings)
		}}
	>
		<FormattedMessage id="GoSettings.label" />
	</Button>
)
