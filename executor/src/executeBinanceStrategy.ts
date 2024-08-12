import { BinanceExchangeInfoCacheMap, BinanceKlinesCacheMap } from "@workspace/binance"
import { ExecutorDatabase } from "@workspace/database"
import { DflowBinanceExecutor, DflowCommonContext, getDflowBinanceNodesCatalog } from "@workspace/dflow"
import { AccountStrategyKey, BalanceEvent, createdNow, isStrategyFlowGraph, newOrder, StrategyFlow, StrategyScheduling } from "@workspace/models"
import { now, today, truncateTime } from "minimal-time-helpers"

import { Binance } from "./binance.js"
import { FOUR_WEEKS } from "./durations.js"

const exchangeInfoCache = new BinanceExchangeInfoCacheMap()
const klinesCache = new BinanceKlinesCacheMap(FOUR_WEEKS)

export async function executeBinanceStrategy (
	{ accountId, ...strategyKey }: AccountStrategyKey,
	scheduling: StrategyScheduling,
	strategyFlow: StrategyFlow,
	executorDatabase: ExecutorDatabase
): Promise<Pick<DflowCommonContext, "memory" | "memoryChanged">> {
	const memoryInput = scheduling.memory ?? {}
	const params = scheduling.params ?? {}

	const binance = new Binance(accountId)
	binance.publicClient.exchangeInfoCache = exchangeInfoCache
	binance.publicClient.klinesCache = klinesCache

	// Truncate logical time to minute. It is a good compromise also to
	// cache klines data.
	//
	// TODO is this correct?
	const time = truncateTime(now()).to.minute

	const { symbols } = await binance.exchangeInfo()
	const nodesCatalog = getDflowBinanceNodesCatalog(symbols)

	// TODO should use the StrategyFlowGraph
	// it may be on another file or in { graph } or parsed from view
	const { view } = strategyFlow
	if (!isStrategyFlowGraph(view)) return {
		memoryChanged: false,
		memory: {}
	}

	const executor = new DflowBinanceExecutor()
	executor.nodesCatalog = nodesCatalog

	const { balance, memory: memoryOutput, memoryChanged, orders } = await executor.run({ binance, params, memory: memoryInput, time }, view)

	const day = today()

	if (orders.length > 0) {
		const strategyOrders = orders.map((info) => newOrder(info))

		await executorDatabase.AppendStrategyDailyOrders({ accountId, day, items: strategyOrders, ...strategyKey })

		const accountOrders = strategyOrders.map((order) => ({ order, ...strategyKey }))

		await executorDatabase.AppendAccountDailyOrders({ accountId, day, items: accountOrders })
	}

	if (balance.length > 0) {
		const balanceEvent: BalanceEvent = { balance, ...strategyKey, ...createdNow() }

		await executorDatabase.AppendAccountBalanceEvent({ accountId, day, item: balanceEvent })
	}

	return { memoryChanged, memory: memoryOutput }
}
