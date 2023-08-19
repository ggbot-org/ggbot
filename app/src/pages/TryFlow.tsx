import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../components/PageContainer.js"
import { TryFlow } from "../components/TryFlow.js"
import { StrategyProvider } from "../contexts/Strategy.js"
import { StrategyFlowProvider } from "../contexts/StrategyFlow.js"

export const TryFlowPage: FC = () => (
	<I18nProvider>
		<PageContainer>
			<StrategyProvider>
				<StrategyFlowProvider>
					<TryFlow />
				</StrategyFlowProvider>
			</StrategyProvider>
		</PageContainer>
	</I18nProvider>
)
