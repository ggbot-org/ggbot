import { Content, H1, H2, H3, Page, Paragraph } from '_/components/library'
import { NoNetwork } from '_/components/NoNetwork'
import { Footer } from '_/components/public/Footer'
import { Navigation } from '_/components/public/Navigation'
import { formattedMessageMarkup, formattedMessageMarkupWithLinkTo } from '_/i18n/formattedMessageMarkup'
import { webapp } from '_/routing/webapp'
import { exchange, telegram } from '@workspace/locators'
import { FormattedMessage } from 'react-intl'

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
					<FormattedMessage id="Terms.welcome" values={formattedMessageMarkup} />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.access" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.accessWithEmail" values={formattedMessageMarkup} />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.product" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.strategies" values={formattedMessageMarkup} />
				</Paragraph>
				<Paragraph>
					<FormattedMessage id="Terms.profitAndLoss" values={formattedMessageMarkupWithLinkTo(telegram.support)} />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.binance" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.binanceApi" values={formattedMessageMarkupWithLinkTo(exchange.binance.homepage)} />
				</Paragraph>
				<Paragraph>
					<FormattedMessage id="Terms.binanceNoWithdrawals" values={formattedMessageMarkup} />
				</Paragraph>
				<H2>
					<FormattedMessage id="Terms.supportedCountries" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.binanceUSisNotSupported" values={formattedMessageMarkup} />
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
					<FormattedMessage id="Terms.fullfillmentPolicies" values={formattedMessageMarkupWithLinkTo(telegram.support)} />
				</Paragraph>
				<H2>
					<FormattedMessage id="Privacy.title" />
				</H2>
				<Paragraph>
					<FormattedMessage id="Terms.privacy" values={formattedMessageMarkupWithLinkTo(webapp.privacy.pathname)} />
				</Paragraph>
			</Content>
		</Page>
	)
}
