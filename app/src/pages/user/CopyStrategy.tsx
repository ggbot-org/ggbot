import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../../components/PageContainer.js"
import { CopyStrategy } from "../../components/user/CopyStrategy.js"
import { AuthenticationProvider } from "../../contexts/Authentication.js"
import { StrategiesProvider } from "../../contexts/user/Strategies.js"
import { StrategyProvider } from "../../contexts/user/Strategy.js"

export const CopyStrategyPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<StrategiesProvider>
					<StrategyProvider>
						<CopyStrategy />
					</StrategyProvider>
				</StrategiesProvider>
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)
