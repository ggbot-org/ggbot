import { Classname } from '_/classnames'
import { FormattedMessage } from '_/i18n/components'
import { webapp } from '_/routing/webapp'

export function TermsAndPolicyLinks() {
	return (
		<ul className={'terms-and-policy-links' satisfies Classname}>
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
	)
}
