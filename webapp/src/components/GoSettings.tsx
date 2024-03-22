import { Button } from "_/components/library"
import { webapp } from "_/routing/webapp"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const GoSettings: FC = () => (
	<Button
		onClick={() => {
			// @ts-expect-error
			location.href = webapp.user.settings
		}}
	>
		<FormattedMessage id="GoSettings.label" />
	</Button>
)
