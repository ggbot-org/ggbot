import { Container, Content, Section, Title } from "_/components/library"
import { PageContainer } from "_/components/PageContainer.js"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const PrivacyPage: FC = () => (
	<PageContainer>
		<Container>
			<Content>
				<Section>
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
				</Section>
			</Content>
		</Container>
	</PageContainer>
)
