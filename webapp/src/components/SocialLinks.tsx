import { github, telegram } from "@workspace/locators"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const SocialLinks: FC = () => (
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
