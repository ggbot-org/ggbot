import { Button } from "_/components/library"
import { webapp } from "_/routing/webapp"
import { FC, useState } from "react"
import { FormattedMessage } from "react-intl"

export const GoSettings: FC = () => {
	const [isPending, setIsPending] = useState(false)

	const onClick = () => {
		setIsPending(true)
		window.location.pathname = webapp.user.settings.pathname
	}

	return (
		<Button isLoading={isPending} onClick={onClick}>
			<FormattedMessage id="GoSettings.label" />
		</Button>
	)
}
