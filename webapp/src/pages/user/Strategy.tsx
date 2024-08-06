import { StrategyActions } from "_/components/StrategyActions"
import { TabId, Tabs } from "_/components/Tabs"
import { PageContainer } from "_/components/user/PageContainer"
import { PleasePurchase } from "_/components/user/PleasePurchase"
import { Schedulings } from "_/components/user/Schedulings"
import { StrategyErrors } from "_/components/user/StrategyErrors"
import { StrategyPageContainer } from "_/components/user/StrategyPageContainer"
import { StrategyProfits } from "_/components/user/StrategyProfits"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useState } from "react"

export function StrategyPage() {
	const [activeTabId, setActiveTabId] = useState<TabId>("manage")
	const { strategyKey } = useStrategyKey()
	const {
		strategyId,
		strategyName,
		strategyWhenCreated,
		strategyNotFound,
		readStrategyIsPending,
		resetStrategy
	} = useStrategy(strategyKey)
	return (
		<PageContainer>
			<StrategyPageContainer strategyKey={strategyKey} strategyNotFound={strategyNotFound}>
				<Tabs
					activeTabId={activeTabId}
					setActiveTabId={setActiveTabId}
					tabs={[
						{
							tabId: "manage",
							content: (
								<>
									<StrategyActions
										readOnly={false}
										readStrategyIsPending={readStrategyIsPending}
										resetStrategy={resetStrategy}
										strategyId={strategyId}
										strategyKey={strategyKey}
										strategyName={strategyName}
										strategyWhenCreated={strategyWhenCreated}
									/>
									<Schedulings />
								</>
							)
						},
						{
							tabId: "profits",
							content: (
								<StrategyProfits strategyKey={strategyKey} />
							)
						},
						{
							tabId: "errors",
							content: <StrategyErrors />
						}
					]}
				/>
				<PleasePurchase />
			</StrategyPageContainer>
		</PageContainer>
	)
}
