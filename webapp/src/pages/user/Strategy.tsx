import { FC } from "react"

import { Strategy } from "../../components/user/Strategy.js"
import { StrategyFlowProvider } from "../../contexts/StrategyFlow.js"
import { BinanceApiConfigProvider } from "../../contexts/user/BinanceApiConfig.js"
import { StrategiesProvider } from "../../contexts/user/Strategies.js"
import { StrategyProvider } from "../../contexts/user/Strategy.js"
import { SubscriptionProvider } from "../../contexts/user/Subscription.js"
import { PageContainer } from "./PageContainer.js"

export const StrategyPage: FC = () => (
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
)
