import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { CopyStrategy } from "../components/CopyStrategy.js"
import { PageContainer } from "../components/PageContainer.js"
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js"
import { AuthenticationProvider } from "../contexts/Authentication.js"
import { StrategyProvider } from "../contexts/Strategy.js"

export const CopyStrategyPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<AccountStrategiesProvider>
					<StrategyProvider>
						<CopyStrategy />
					</StrategyProvider>
				</AccountStrategiesProvider>
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)
