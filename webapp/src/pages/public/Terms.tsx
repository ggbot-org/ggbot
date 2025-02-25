import { Content, H1, H2, H3, Page, Paragraph } from '_/components/library'
import { NoNetwork } from '_/components/NoNetwork'
import { Footer } from '_/components/public/Footer'
import { Navigation } from '_/components/public/Navigation'
import { FormattedMessage } from '_/i18n/components'
import { webapp } from '_/routing/webapp'
import { exchange, telegram } from '@workspace/locators'

export function TermsPage() {
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
					<FormattedMessage id="Terms.title" />
				</H1>
				<Paragraph>
					<FormattedMessage id="Terms.welcome" />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.access" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.accessWithEmail" />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.product" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.strategies" />
				</Paragraph>
				<Paragraph>
					<FormattedMessage
						id="Terms.profitAndLoss"
						values={{ href: telegram.support }}
					/>
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.binance" />
				</H2>
				<Paragraph>
					<FormattedMessage
						id="Terms.binanceApi"
						values={{ href: exchange.binance.homepage }}
					/>
				</Paragraph>
				<Paragraph>
					<FormattedMessage id="Terms.binanceNoWithdrawals" />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.supportedCountries" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.binanceUSisNotSupported" />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.payments" />
				</H2>
				<H3>
					<FormattedMessage id="Terms.pricing" />
				</H3>
				<Paragraph>
					<FormattedMessage id="Terms.pricingVat" />
				</Paragraph>
				<H3>
					<FormattedMessage id="Terms.paymentsFullfillment" />
				</H3>
				<Paragraph>
					<FormattedMessage
						id="Terms.fullfillmentPolicies"
						values={{ href: telegram.support }}
					/>
				</Paragraph>
				<H2>
					<FormattedMessage id="Privacy.title" />
				</H2>
				<Paragraph>
					<FormattedMessage
						id="Terms.privacy"
						values={{ href: webapp.privacy.pathname }}
					/>
				</Paragraph>
			</Content>
		</Page>
	)
}
