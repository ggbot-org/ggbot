import { classnames } from "_/classnames"
import { Column, Columns, IconText } from "_/components/library"
import { TermsAndPolicyLinks } from "_/components/TermsAndPolicyLinks"
import { dayFormat } from "_/i18n/formats"
import { github, telegram } from "@workspace/locators"
import { FormattedMessage, useIntl } from "react-intl"

function SocialLinks() {
	return (
		<ul>
			<li>
				<a href={telegram.support}>
					<IconText name="telegram" size="1.5em">
						<FormattedMessage id="SocialLinks.telegramSupport" />
					</IconText>
				</a>
			</li>
			<li>
				<a href={github.organization}>
					<IconText name="github" size="1.5em">
						<FormattedMessage id="SocialLinks.githubOrganizaton" />
					</IconText>
				</a>
			</li>
		</ul>
	)
}

export function Footer() {
	const { formatDate } = useIntl()
	return (
		<>
			<div className={classnames("footer__top")} />
			<footer className={classnames("footer", "footer__body")}>
				<Columns>
					<Column bulma="is-narrow">
						<div className={classnames("ml-1", "mr-3")}>
							<TermsAndPolicyLinks />
						</div>
					</Column>
					<Column>
						<SocialLinks />
					</Column>
				</Columns>
				<div className={classnames("ml-1")}>
					<FormattedMessage
						id="Footer.lastUpdate"
						values={{ day: formatDate(BUILD_DATE, dayFormat) }}
					/>
					<br />
					<sub>
						<FormattedMessage id="Footer.noTracking" />
					</sub>
				</div>
			</footer>
		</>
	)
}
