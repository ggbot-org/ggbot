import { github, telegram } from "@workspace/locators"
import { FormattedMessage } from "react-intl"

export function SocialLinks() {
	return (
		<ul>
			<li>
				<a href={telegram.support}>
					<FormattedMessage id="SocialLinks.telegramSupport" />
				</a>
			</li>

			<li>
				<a href={github.organization}>
					<FormattedMessage id="SocialLinks.githubOrganizaton" />
				</a>
			</li>
		</ul>
	)
}
