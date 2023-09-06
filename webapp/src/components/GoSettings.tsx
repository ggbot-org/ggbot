import { Button } from "_/components/library"
import { href } from "_/routing/user/hrefs.js"
import { SettingsPageId } from "_/routing/user/types.js"
import { FC, useState } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	settingsPage: SettingsPageId
}

export const GoSettings: FC<Props> = ({ settingsPage }) => {
	const [isPending, setIsPending] = useState(false)

	const onClick = () => {
		setIsPending(true)
		window.location.href = href.settingsPage(settingsPage)
	}

	return (
		<Button isLoading={isPending} onClick={onClick}>
			<FormattedMessage id="GoSettings.label" />
		</Button>
	)
}
