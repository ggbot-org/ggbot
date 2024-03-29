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
import {
	formattedMessageMarkup,
	formattedMessageMarkupWithLinkTo
} from "_/i18n/formattedMessageMarkup"
import { amazonWebServices, binance, stripe } from "@workspace/locators"
import { numYearsTradingOperationsRetention } from "@workspace/models"
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
							values={formattedMessageMarkup}
						/>
					</Paragraph>

					<H2>
						<FormattedMessage id="Privacy.personalData" />
					</H2>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataOnlyEmail"
							values={formattedMessageMarkup}
						/>
					</Paragraph>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataNotShared"
							values={formattedMessageMarkup}
						/>
					</Paragraph>

					<H3>
						<FormattedMessage id="Privacy.cloudProvider" />
					</H3>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataSecureStorage"
							values={formattedMessageMarkupWithLinkTo(
								amazonWebServices.homepage
							)}
						/>
					</Paragraph>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataEmailService"
							values={formattedMessageMarkup}
						/>
					</Paragraph>

					<Paragraph>
						<FormattedMessage
							id="Privacy.personalDataEmailUsage"
							values={formattedMessageMarkup}
						/>
					</Paragraph>

					<H3>
						<FormattedMessage id="Privacy.paymentProvider" />
					</H3>

					<Paragraph>
						<FormattedMessage
							id="Privacy.stripe"
							values={formattedMessageMarkupWithLinkTo(
								stripe.homepage
							)}
						/>
					</Paragraph>

					<H2>
						<FormattedMessage id="Privacy.marketProviders" />
					</H2>

					<H3>
						<FormattedMessage id="Privacy.binance" />
					</H3>

					<Paragraph>
						<FormattedMessage
							id="Privacy.binanceCustomerData"
							values={formattedMessageMarkupWithLinkTo(
								binance.homepage
							)}
						/>
					</Paragraph>

					<Paragraph>
						<FormattedMessage
							id="Privacy.binanceTradingData"
							values={{
								numYears: numYearsTradingOperationsRetention,
								...formattedMessageMarkup
							}}
						/>
					</Paragraph>
				</Section>
			</Content>
		</Container>
	</PageContainer>
)
