import { AccountInfo, Strategy, StrategyKey } from '@workspace/models'
import { Day } from 'minimal-time-helpers'

import { cachedBoolean, cachedNumber, cachedObject } from './cache.js'
import { itemKey } from './items.js'
import { SessionWebStorageProvider } from './providers.js'

const storage = new SessionWebStorageProvider()

export class SessionWebStorage {
	get accountInfo() {
		return cachedObject<AccountInfo>(storage, itemKey.accountInfo())
	}

	get estimatedNumStrategies() {
		return cachedNumber(storage, itemKey.estimatedNumStrategies())
	}

	get strategiesDayIntervalStart() {
		return cachedObject<Day>(storage, itemKey.strategiesDayIntervalStart())
	}

	get strategiesDayIntervalEnd() {
		return cachedObject<Day>(storage, itemKey.strategiesDayIntervalEnd())
	}

	get doNotShowPleasePurchase() {
		return cachedBoolean(storage, itemKey.doNotShowPleasePurchase())
	}

	get gotFirstPageView() {
		return cachedBoolean(storage, itemKey.gotFirstPageView())
	}

	strategy(strategyKey: StrategyKey) {
		return cachedObject<Strategy>(storage, itemKey.strategy(strategyKey))
	}

	clear() {
		storage.clear()
	}
}
