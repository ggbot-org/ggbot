import { CacheMap } from "@workspace/cache"
import { PublicDatabase } from "@workspace/database"
import { StrategyFlow, StrategyKey } from "@workspace/models"

import { ONE_HOUR } from "./durations.js"
import { info, warn } from "./logging.js"

export class StrategyFlowProvider {
	readonly cache: CacheMap<StrategyFlow>
	private readonly database: PublicDatabase

	constructor(database: PublicDatabase) {
		this.cache = new CacheMap<StrategyFlow>(ONE_HOUR)
		this.database = database
	}
	/**
	 * Check if subscription is active.
	 */
	async readStrategyFlow(strategyKey: StrategyKey): Promise<StrategyFlow | null> {
		try {
			const { strategyId } = strategyKey
			const cached = this.cache.get(strategyId)
			if (cached) return cached
			info("readStrategyFlow", strategyId)
			const strategyFlow = await this.database.ReadStrategyFlow(strategyKey)
			if (strategyFlow) this.cache.set(strategyId, strategyFlow)
			return strategyFlow
		} catch (error) {
			warn(error)
			return null
		}
	}
}