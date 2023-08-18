import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { AuthenticationProvider } from "../authentication/contexts/Authentication.js"
import { PageContainer } from "../components/PageContainer.js"
import { Strategy } from "../components/Strategy.js"
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js"
import { BinanceApiConfigProvider } from "../contexts/BinanceApiConfig.js"
import { StrategyProvider } from "../contexts/Strategy.js"
import { SubscriptionProvider } from "../contexts/Subscription.js"
import { StrategyFlowProvider } from "../public/contexts/StrategyFlow.js"

export const StrategyPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<AccountStrategiesProvider>
					<SubscriptionProvider>
						<BinanceApiConfigProvider>
							<StrategyProvider>
								<StrategyFlowProvider>
									<Strategy />
								</StrategyFlowProvider>
							</StrategyProvider>
						</BinanceApiConfigProvider>
					</SubscriptionProvider>
				</AccountStrategiesProvider>
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)
