import { Container, Content, H1, H2, Section } from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { webapp } from "_/routing/webapp"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const TermsPage: FC = () => (
	<PageContainer>
		<Container>
			<Section>
				<Content>
					<H1>
						<FormattedMessage id="Terms.title" />
					</H1>

					<p>
						<FormattedMessage
							id="Terms.welcome"
							values={{
								em: (chuncks) => <em>{chuncks}</em>
							}}
						/>
					</p>

					<H2>
						<FormattedMessage id="Terms.access" />
					</H2>

					<p>
						<FormattedMessage
							id="Terms.accessWithEmail"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</p>

					<H2>
						<FormattedMessage id="Terms.binance" />
					</H2>

					<p>
						<FormattedMessage
							id="Terms.binanceApi"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</p>

					<p>
						<FormattedMessage
							id="Terms.binanceNoWithdrawals"
							values={{
								b: (chunks) => <b>{chunks}</b>,
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</p>

					<H2>
						<FormattedMessage id="Terms.pricing" />
					</H2>

					<p>
						<FormattedMessage id="Terms.pricingVat" />
					</p>

					<H2>
						<FormattedMessage id="Privacy.title" />
					</H2>

					<p>
						<FormattedMessage
							id="Terms.privacy"
							values={{
								a: (text) => (
									<a href={webapp.privacy.pathname}>{text}</a>
								),
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</p>
				</Content>
			</Section>
		</Container>
	</PageContainer>
)
