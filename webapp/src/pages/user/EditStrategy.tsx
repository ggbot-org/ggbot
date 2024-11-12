import { Backtesting } from '_/components/Backtesting'
import { TabId, Tabs } from '_/components/Tabs'
import { FlowEditor } from '_/components/user/FlowEditor'
import { PageContainer } from '_/components/user/PageContainer'
import { StrategyPageContainer } from '_/components/user/StrategyPageContainer'
import { UseFlowViewOutput } from '_/hooks/useFlowView'
import { useStrategy } from '_/hooks/useStrategy'
import { useStrategyFlow } from '_/hooks/useStrategyFlow'
import { useStrategyKey } from '_/hooks/useStrategyKey'
import { useState } from 'react'

export function EditStrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>('flow')
	const [flowView, setFlowView] = useState<UseFlowViewOutput>({ flowViewGraph: undefined, whenUpdatedFlowView: undefined })

	const { strategyKey } = useStrategyKey()
	const { strategyName, strategyFrequency, strategyNotFound } = useStrategy(strategyKey)
	const { strategyFlow } = useStrategyFlow(strategyKey)

	return (
		<PageContainer>
			<StrategyPageContainer strategyKey={strategyKey} strategyNotFound={strategyNotFound}>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: 'flow',
							renderIfInactive: true,
							content: (
								<FlowEditor
									setFlowView={setFlowView}
									strategyFlow={strategyFlow}
									strategyKey={strategyKey}
									strategyName={strategyName}
								/>
							)
						},
						{
							tabId: 'backtesting',
							renderIfInactive: true,
							content: (
								<Backtesting
									{...flowView}
									strategyFrequency={strategyFrequency}
									strategyKey={strategyKey}
									strategyName={strategyName}
								/>
							)
						}
					]}
				/>
			</StrategyPageContainer>
		</PageContainer>
	)
}
