import { classNames } from "_/classNames"
import { dayFormat } from "_/i18n/formats"
import { href } from "_/routing/public/hrefs"
import { memo } from "react"
import { FormattedMessage, useIntl } from "react-intl"

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
