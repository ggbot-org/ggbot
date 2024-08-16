import { Backtesting } from "_/components/Backtesting"
import { Page } from "_/components/library"
import { NoNetwork } from "_/components/NoNetwork"
import { Footer } from "_/components/public/Footer"
import { Navigation } from "_/components/public/Navigation"
import { StrategyActions } from "_/components/public/StrategyActions"
import { TabId, Tabs } from "_/components/Tabs"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useState } from "react"

export function SharedStrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("info")
	const { strategyKey } = useStrategyKey()
	const { strategyId, strategyName, strategyWhenCreated, strategyFrequency, strategyNotFound, readStrategyIsPending } = useStrategy(strategyKey)
	const { strategyFlow } = useStrategyFlow(strategyKey)
	return (
		<Page
			footer={<Footer />}
			header={
				<>
					<NoNetwork />
					<Navigation />
				</>
			}
		>
			<StrategyPageContainer strategyKey={strategyKey} strategyNotFound={strategyNotFound}>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "info",
							renderIfInactive: true,
							content: (
								<StrategyActions
									readStrategyIsPending={readStrategyIsPending}
									strategyId={strategyId}
									strategyKey={strategyKey}
									strategyName={strategyName}
									strategyWhenCreated={strategyWhenCreated}
								/>
							)
						},
						{
							tabId: "backtesting",
							renderIfInactive: true,
							content: (
								<Backtesting
									strategyFlow={strategyFlow}
									strategyFrequency={strategyFrequency}
									strategyKey={strategyKey}
									strategyName={strategyName}
								/>
							)
						}
					]}
				/>
			</StrategyPageContainer>
		</Page>
	)
}
