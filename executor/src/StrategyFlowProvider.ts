import { CacheMap } from "@workspace/cache"
import { PublicDatabase } from "@workspace/database"
import { StrategyFlow, StrategyKey } from "@workspace/models"

import { ONE_HOUR } from "./durations.js"

export class StrategyFlowProvider {
	readonly cache: CacheMap<StrategyFlow>
	private readonly database: PublicDatabase
	constructor(database: PublicDatabase) {
		this.cache = new CacheMap<StrategyFlow>(ONE_HOUR)
		this.database = database
	}
	async readStrategyFlow(strategyKey: StrategyKey): Promise<StrategyFlow | null> {
		const { strategyId } = strategyKey
		const cached = this.cache.get(strategyId)
		if (cached) return cached
		const strategyFlow = await this.database.ReadStrategyFlow(strategyKey)
		if (strategyFlow) this.cache.set(strategyId, strategyFlow)
		return strategyFlow
	}
}
