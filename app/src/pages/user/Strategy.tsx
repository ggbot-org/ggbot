import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../../components/PageContainer.js"
import { Strategy } from "../../components/user/Strategy.js"
import { AuthenticationProvider } from "../../contexts/Authentication.js"
import { StrategyFlowProvider } from "../../contexts/StrategyFlow.js"
import { BinanceApiConfigProvider } from "../../contexts/user/BinanceApiConfig.js"
import { StrategiesProvider } from "../../contexts/user/Strategies.js"
import { StrategyProvider } from "../../contexts/user/Strategy.js"
import { SubscriptionProvider } from "../../contexts/user/Subscription.js"

export const StrategyPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<StrategiesProvider>
					<SubscriptionProvider>
						<BinanceApiConfigProvider>
							<StrategyProvider>
								<StrategyFlowProvider>
									<Strategy />
								</StrategyFlowProvider>
							</StrategyProvider>
						</BinanceApiConfigProvider>
					</SubscriptionProvider>
				</StrategiesProvider>
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)
