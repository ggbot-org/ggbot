import { dayFormat } from "@ggbot2/design"
import { memo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { classNames } from "../styles/classNames.js"

export const Footer = memo(() => {
	const { formatDate } = useIntl()

	return (
		<footer className={classNames("footer")}>
			<FormattedMessage
				id="Footer.lastUpdate"
				values={{ day: formatDate(BUILD_DATE, dayFormat) }}
			/>
		</footer>
	)
})

Footer.displayName = "Footer"
