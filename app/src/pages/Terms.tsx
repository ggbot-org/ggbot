import { Content, Title } from "@ggbot2/design"
import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import { PageContainer } from "../components/PageContainer.js"

export const TermsPage: FC = () => (
	<I18nProvider>
		<PageContainer>
			<Content>
				<Title>
					<FormattedMessage id="Terms.title" />
				</Title>
			</Content>
		</PageContainer>
	</I18nProvider>
)
