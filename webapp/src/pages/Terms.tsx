import { Container, Content, Section, Title } from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { webapp } from "_/routing/webapp"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const TermsPage: FC = () => (
	<PageContainer>
		<Container>
			<Section>
				<Content>
					<Title>
						<FormattedMessage id="Terms.title" />
					</Title>

					<p>
						<FormattedMessage
							id="Terms.welcome"
							values={{
								em: (chuncks) => <em>{chuncks}</em>
							}}
						/>
					</p>

					<h2>
						<FormattedMessage id="Terms.access" />
					</h2>

					<p>
						<FormattedMessage
							id="Terms.accessWithEmail"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</p>

					<h2>
						<FormattedMessage id="Terms.binance" />
					</h2>

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

					<h2>
						<FormattedMessage id="Terms.pricing" />
					</h2>

					<p>
						<FormattedMessage id="Terms.pricingVat" />
					</p>

					<h2>
						<FormattedMessage id="Privacy.title" />
					</h2>

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
