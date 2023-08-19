import { dayFormat } from "@ggbot2/design"
import { memo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { href } from "../routing/public/hrefs.js"
import { classNames } from "../styles/classNames.js"

export const Footer = memo(() => {
	const { formatDate } = useIntl()

	return (
		<footer className={classNames("footer")}>
			<ul>
				<li>
					<a href={href.privacyPage()}>
						<FormattedMessage id="Privacy.title" />
					</a>
				</li>

				<li>
					<a href={href.termsPage()}>
						<FormattedMessage id="Terms.title" />
					</a>
				</li>
			</ul>

			<FormattedMessage
				id="Footer.lastUpdate"
				values={{ day: formatDate(BUILD_DATE, dayFormat) }}
			/>
		</footer>
	)
})

Footer.displayName = "Footer"
