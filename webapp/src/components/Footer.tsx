import { classNames } from "_/classNames"
import { SocialLinks } from "_/components/SocialLinks"
import { TermsAndPolicyLinks } from "_/components/TermsAndPolicyLinks"
import { dayFormat } from "_/i18n/formats"
import { FormattedMessage, useIntl } from "react-intl"

export function Footer() {
	const { formatDate } = useIntl()

	return (
		<>
			<div className={classNames("Footer__top")} />

			<footer className={classNames("footer", "Footer__body")}>
				<TermsAndPolicyLinks />

				<SocialLinks />

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
