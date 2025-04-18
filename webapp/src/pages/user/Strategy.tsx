import { TabId, Tabs } from '_/components/Tabs'
import { PageContainer } from '_/components/user/PageContainer'
import { PleasePurchase } from '_/components/user/PleasePurchase'
import { Schedulings } from '_/components/user/Schedulings'
import { StrategyActions } from '_/components/user/StrategyActions'
import { StrategyErrors } from '_/components/user/StrategyErrors'
import { StrategyPageContainer } from '_/components/user/StrategyPageContainer'
import { StrategyProfits } from '_/components/user/StrategyProfits'
import { useStrategy } from '_/hooks/useStrategy'
import { useStrategyKey } from '_/hooks/useStrategyKey'
import { useState } from 'react'

export function StrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>('manage')
	const { strategyKey } = useStrategyKey()
	const { strategyNotFound, ...otherStrategyActionProps } =
		useStrategy(strategyKey)
	return (
		<PageContainer>
			<StrategyPageContainer
				strategyKey={strategyKey}
				strategyNotFound={strategyNotFound}
			>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: 'manage',
							renderIfInactive: true,
							content: (
								<>
									<StrategyActions
										strategyKey={strategyKey}
										{...otherStrategyActionProps}
									/>
									<Schedulings strategyKey={strategyKey} />
								</>
							),
						},
						{
							tabId: 'profits',
							content: <StrategyProfits strategyKey={strategyKey} />,
						},
						{
							tabId: 'errors',
							content: <StrategyErrors strategyKey={strategyKey} />,
						},
					]}
				/>
				<PleasePurchase />
			</StrategyPageContainer>
		</PageContainer>
	)
}
