import { Backtesting } from "_/components/Backtesting"
import { TabId, Tabs } from "_/components/Tabs"
import { FlowEditor } from "_/components/user/FlowEditor"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useState } from "react"

export function EditStrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("flow")
	const { strategyKey } = useStrategyKey()
	const { strategyName, strategyFrequency, strategyNotFound } = useStrategy(strategyKey)

	return (
		<PageContainer>
			<StrategyPageContainer strategyNotFound={strategyNotFound} strategyKey={strategyKey}>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "flow",
							content: (
								<FlowEditor
									strategyKey={strategyKey}
									strategyName={strategyName}
								/>
							)
						},
						{
							tabId: "backtesting",
							content: (
								<Backtesting
									strategyKey={strategyKey}
									strategyName={strategyName}
									strategyFrequency={strategyFrequency}
								/>
							)
						}
					]}
				/>
			</StrategyPageContainer>
		</PageContainer>
	)
}
