import { Container, Content, H1, H2, Section } from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const PrivacyPage: FC = () => (
	<PageContainer>
		<Container>
			<Content>
				<Section>
					<H1>
						<FormattedMessage id="Privacy.title" />
					</H1>

					<p>
						<FormattedMessage
							id="Privacy.welcome"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</p>

					<H2>
						<FormattedMessage id="Privacy.personalData" />
					</H2>

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
