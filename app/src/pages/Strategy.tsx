import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../components/PageContainer.js"
import { Strategy } from "../components/Strategy.js"
import { StrategyProvider } from "../contexts/Strategy.js"
import { StrategyFlowProvider } from "../contexts/StrategyFlow.js"

export const StrategyPage: FC = () => (
	<I18nProvider>
		<PageContainer>
			<StrategyProvider>
				<StrategyFlowProvider>
					<Strategy />
				</StrategyFlowProvider>
			</StrategyProvider>
		</PageContainer>
	</I18nProvider>
)
