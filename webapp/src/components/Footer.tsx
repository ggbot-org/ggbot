import { classNames } from "_/classNames"
import { dayFormat } from "_/i18n/formats"
import { webapp } from "_/routing/webapp"
import { FC } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const Footer: FC = () => {
	const { formatDate } = useIntl()

	return (
		<>
			<div className={classNames("Footer__top")} />

			<footer className={classNames("footer", "Footer__body")}>
				<ul>
					<li>
						<a href={webapp.privacy.pathname}>
							<FormattedMessage id="Privacy.title" />
						</a>
					</li>

					<li>
						<a href={webapp.terms.pathname}>
							<FormattedMessage id="Terms.title" />
						</a>
					</li>
				</ul>

				<FormattedMessage
					id="Footer.lastUpdate"
					values={{ day: formatDate(BUILD_DATE, dayFormat) }}
				/>

				<sub>
					<FormattedMessage id="Footer.noTracking" />
				</sub>
			</footer>
		</>
	)
}
