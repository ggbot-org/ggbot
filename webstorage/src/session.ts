import { AccountInfo, AccountStrategy, Strategy, StrategyKey } from "@workspace/models"
import { Day } from "minimal-time-helpers"

import { cachedBoolean, cachedObject } from "./cache.js"
import { itemKey } from "./items.js"
import { SessionWebStorageProvider } from "./providers.js"

export class SessionWebStorage {
	private storage = new SessionWebStorageProvider()

	get accountInfo() {
		return cachedObject<AccountInfo>(this.storage, itemKey.accountInfo())
	}

	get accountStrategies() {
		return cachedObject<AccountStrategy[]>(
			this.storage,
			itemKey.accountStrategies()
		)
	}

	get strategiesDayIntervalStart() {
		return cachedObject<Day>(this.storage, itemKey.strategiesDayIntervalStart())
	}

	get strategiesDayIntervalEnd() {
		return cachedObject<Day>(this.storage, itemKey.strategiesDayIntervalEnd())
	}

	get doNotShowPleasePurchase() {
		return cachedBoolean(this.storage, itemKey.doNotShowPleasePurchase())
	}

	get gotFirstPageView() {
		return cachedBoolean(this.storage, itemKey.gotFirstPageView())
	}

	strategy(strategyKey: StrategyKey) {
		return cachedObject<Strategy>(
			this.storage,
			itemKey.strategy(strategyKey)
		)
	}

	clear() {
		this.storage.clear()
	}
}
