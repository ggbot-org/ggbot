import { Content, H1, H2, H3, Page, Paragraph } from '_/components/library'
import { NoNetwork } from '_/components/NoNetwork'
import { Footer } from '_/components/public/Footer'
import { Navigation } from '_/components/public/Navigation'
import { FormattedMessage } from '_/i18n/components'
import { amazonWebServices, exchange, stripe } from '@workspace/locators'
import { numYearsTradingOperationsRetention } from '@workspace/models'

export function PrivacyPage() {
	return (
		<Page
			footer={<Footer />}
			header={
				<>
					<NoNetwork />
					<Navigation />
				</>
			}
		>
			<Content>
				<H1>
					<FormattedMessage id="Privacy.title" />
				</H1>
				<Paragraph>
					<FormattedMessage id="Privacy.welcome" />
				</Paragraph>
				<H2>
					<FormattedMessage id="Privacy.personalData" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Privacy.personalDataOnlyEmail" />
				</Paragraph>
				<Paragraph>
					<FormattedMessage id="Privacy.personalDataNotShared" />
				</Paragraph>
				<H3>
					<FormattedMessage id="Privacy.cloudProvider" />
				</H3>
				<Paragraph>
					<FormattedMessage
						id="Privacy.personalDataSecureStorage"
						values={{ href: amazonWebServices.homepage }}
					/>
				</Paragraph>
				<Paragraph>
					<FormattedMessage id="Privacy.personalDataEmailService" />
				</Paragraph>
				<Paragraph>
					<FormattedMessage id="Privacy.personalDataEmailUsage" />
				</Paragraph>
				<H3>
					<FormattedMessage id="Privacy.paymentProvider" />
				</H3>
				<Paragraph>
					<FormattedMessage
						id="Privacy.stripe"
						values={{ href: stripe.homepage }}
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
						values={{ href: exchange.binance.homepage }}
					/>
				</Paragraph>
				<Paragraph>
					<FormattedMessage
						id="Privacy.binanceTradingData"
						values={{ numYears: numYearsTradingOperationsRetention }}
					/>
				</Paragraph>
			</Content>
		</Page>
	)
}
