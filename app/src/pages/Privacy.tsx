import { Content, Title } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import { PageContainer } from "./PageContainer.js"

export const PrivacyPage: FC = () => (
	<PageContainer>
		<Content>
			<Title>
				<FormattedMessage id="Privacy.title" />
			</Title>

			<p>
				<FormattedMessage
					id="Privacy.welcome"
					values={{
						em: (chunks) => <em>{chunks}</em>
					}}
				/>
			</p>

			<h2>
				<FormattedMessage id="Privacy.personalData" />
			</h2>

			<p>
				<FormattedMessage
					id="Privacy.personalDataNotShared"
					values={{
						em: (chunks) => <em>{chunks}</em>
					}}
				/>
			</p>

			<p>
				<FormattedMessage
					id="Privacy.personalDataOnlyEmail"
					values={{
						em: (chunks) => <em>{chunks}</em>
					}}
				/>
			</p>

			<p>
				<FormattedMessage
					id="Privacy.personalDataEmailUsage"
					values={{
						em: (chunks) => <em>{chunks}</em>
					}}
				/>
			</p>

			<p>
				<FormattedMessage
					id="Privacy.personalDataSecureStorage"
					values={{
						em: (chunks) => <em>{chunks}</em>
					}}
				/>
			</p>

			<p>
				<FormattedMessage
					id="Privacy.personalDataEmailService"
					values={{
						em: (chunks) => <em>{chunks}</em>
					}}
				/>
			</p>
		</Content>
	</PageContainer>
)
