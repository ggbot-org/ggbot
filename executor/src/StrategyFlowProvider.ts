import { CacheMap } from "@workspace/cache"
import { PublicDatabase } from "@workspace/database"
import { StrategyFlow, StrategyKey } from "@workspace/models"

import { ONE_HOUR } from "./durations.js"

const cache = new CacheMap<StrategyFlow>(ONE_HOUR)

export class StrategyFlowProvider {
	readonly database: PublicDatabase

	constructor(database: PublicDatabase) {
		this.database = database
	}

	async readStrategyFlow(strategyKey: StrategyKey): Promise<StrategyFlow | null> {
		const { strategyId } = strategyKey
		const cached = cache.get(strategyId)
		if (cached) return cached
		const strategyFlow = await this.database.ReadStrategyFlow(strategyKey)
		if (strategyFlow) cache.set(strategyId, strategyFlow)
		return strategyFlow
	}
}
