import { classnames } from "_/classnames"
import { webapp } from "_/routing/webapp"
import { FormattedMessage } from "react-intl"

export function TermsAndPolicyLinks() {
	return (
		<ul className={classnames("TermsAndPolicyLinks")}>
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
