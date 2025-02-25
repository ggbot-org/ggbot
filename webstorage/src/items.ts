import { StrategyKey } from '@workspace/models'

type ItemKey =
	| 'accountInfo'
	| 'activeTabId'
	| 'authToken'
	| 'doNotShowPleasePurchase'
	| 'estimatedNumStrategies'
	| 'gotFirstPageView'
	| 'hideInactiveStrategies'
	| 'strategy'
	| 'strategiesDayIntervalStart'
	| 'strategiesDayIntervalEnd'

/**
 * Get item keys used by session and local storage.
 *
 * @remarks
 * Every item key includes a version. Every version can be updated
 * independently: it should be done when type of value changes.
 *
 * Notice that `DEBUG_*` are used internally and do not have a version.
 */
export const itemKey: Record<ItemKey, (...args: any[]) => string> = {
	accountInfo: () => 'accountInfo',
	activeTabId: (pageName: string) => `${pageName}:activeTab`,
	authToken: () => 'authToken',
	estimatedNumStrategies: () => 'estimatedNumStrategies',
	strategiesDayIntervalStart: () => 'strategiesDayIntervalStart',
	strategiesDayIntervalEnd: () => 'strategiesDayIntervalEnd',
	doNotShowPleasePurchase: () => 'doNotShowPleasePurchase',
	gotFirstPageView: () => 'gotFirstPageView',
	hideInactiveStrategies: () => 'hideInactiveStrategies',
	strategy: ({ strategyId, strategyKind }: StrategyKey) =>
		`strategy:${strategyKind}:${strategyId}`,
}
