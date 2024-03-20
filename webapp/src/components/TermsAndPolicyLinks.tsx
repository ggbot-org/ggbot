import { webapp } from "_/routing/webapp"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const TermsAndPolicyLinks: FC = () => (
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
)
