import { Classname, classnames } from '_/classnames'
import { Column, Columns, Icon, IconText } from '_/components/library'
import { TermsAndPolicyLinks } from '_/components/TermsAndPolicyLinks'
import { FormattedMessage } from '_/i18n/components'
import { dayFormat } from '_/i18n/formats'
import { useIntl } from '_/i18n/hooks'
import { telegram } from '@workspace/locators'

function SocialLinks() {
	return (
		<ul>
			<li>
				<a href={telegram.support}>
					<IconText>
						<Icon name="telegram" />
						<span>
							<FormattedMessage id="SocialLinks.telegramSupport" />
						</span>
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
			<div className={'footer__top' satisfies Classname} />
			<footer className={classnames('footer', 'footer__body')}>
				<Columns>
					<Column bulma="is-narrow">
						<div className={classnames('ml-1', 'mr-3')}>
							<TermsAndPolicyLinks />
						</div>
					</Column>
					<Column>
						<SocialLinks />
					</Column>
				</Columns>
				<div className={'ml-1' satisfies Classname}>
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
