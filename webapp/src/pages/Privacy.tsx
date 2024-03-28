import {
	Container,
	Content,
	H1,
	H2,
	H3,
	Paragraph,
	Section
} from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { amazonWebServices, stripe } from "@workspace/locators"
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

					<Paragraph>
						<FormattedMessage
							id="Privacy.welcome"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Paragraph>

					<H2>
						<FormattedMessage id="Privacy.personalData" />
					</H2>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataOnlyEmail"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Paragraph>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataNotShared"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Paragraph>

					<H3>
						<FormattedMessage id="Privacy.cloudProvider" />
					</H3>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataSecureStorage"
							values={{
								a: (text) => (
									<a href={amazonWebServices.homepage}>
										{text}
									</a>
								),
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Paragraph>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataEmailService"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Paragraph>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataEmailUsage"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Paragraph>

					<H3>
						<FormattedMessage id="Privacy.paymentProvider" />
					</H3>

					<Paragraph>
						<FormattedMessage
							id="Privacy.stripe"
							values={{
								a: (text) => (
									<a href={stripe.homepage}>{text}</a>
								),
								b: (chunks) => <b>{chunks}</b>,
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Paragraph>
				</Section>
			</Content>
		</Container>
	</PageContainer>
)
