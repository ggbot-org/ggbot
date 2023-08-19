// TODO use translations for this page, then remove this eslint-disable comment
/* eslint-disable react/jsx-newline */
import { Content, Title } from "@ggbot2/design"
import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import { PageContainer } from "../components/PageContainer.js"

export const PrivacyPage: FC = () => (
	<I18nProvider>
		<PageContainer>
			<Content>
				<Title>
					<FormattedMessage id="Privacy.title" />
				</Title>

				<p>
					<FormattedMessage id="Privacy.welcome" />
				</p>

				<h2>Personal Data</h2>

				<p>Your personal data is not shared with third parties.</p>

				<p>
					No personal data is collected other than your account email.
				</p>

				<p>Your email is used for authentication and communications.</p>

				<p>
					We store all Personal Data on secure servers administered by{" "}
					<em>AWS</em> (Amazon Web Services).
				</p>

				<p>
					No third party service is used for email communications, we
					are using AWS&apos;s <em>Simple Email Service.</em>
				</p>
			</Content>
		</PageContainer>
	</I18nProvider>
)
