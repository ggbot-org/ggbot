import { Button } from "@ggbot2/design"
import { FC, useState } from "react"
import { FormattedMessage } from "react-intl"

import { href } from "../routing/hrefs.js"
import { SettingsPageId } from "../routing/types.js"

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
