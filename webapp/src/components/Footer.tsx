import { classNames } from "_/classNames"
import { TermsAndPolicyLinks } from "_/components/TermsAndPolicyLinks"
import { dayFormat } from "_/i18n/formats"
import { FC } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const Footer: FC = () => {
	const { formatDate } = useIntl()

	return (
		<>
			<div className={classNames("Footer__top")} />

			<footer className={classNames("footer", "Footer__body")}>
				<TermsAndPolicyLinks />

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
