import { PageContainer } from "_/components/user/PageContainer.js"
import { Strategy } from "_/components/user/Strategy.js"
import { StrategyFlowProvider } from "_/contexts/StrategyFlow.js"
import { BinanceApiConfigProvider } from "_/contexts/user/BinanceApiConfig.js"
import { StrategiesProvider } from "_/contexts/user/Strategies.js"
import { StrategyProvider } from "_/contexts/user/Strategy.js"
import { SubscriptionProvider } from "_/contexts/user/Subscription.js"
import { FC } from "react"

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
