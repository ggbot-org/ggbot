import {
	BinanceExchangeInfoCacheMap,
	BinanceKlinesCacheMap
} from "@workspace/binance"
import { ExecutorDatabase, PublicDatabase } from "@workspace/database"
import {
	DflowBinanceExecutor,
	DflowCommonContext,
	getDflowBinanceNodesCatalog,
	isDflowExecutorView
} from "@workspace/dflow"
import {
	AccountStrategyKey,
	BalanceEvent,
	createdNow,
	ErrorStrategyItemNotFound,
	newOrder,
	StrategyScheduling
} from "@workspace/models"
import { now, today, truncateTime } from "minimal-time-helpers"

import { Binance } from "./binance.js"

const ONE_WEEK = 604_800_000
const exchangeInfoCache = new BinanceExchangeInfoCacheMap()
const klinesCache = new BinanceKlinesCacheMap(ONE_WEEK)

export const executeBinanceStrategy = async (
	{ accountId, ...strategyKey }: AccountStrategyKey,
	scheduling: StrategyScheduling,
	publicDatabase: PublicDatabase,
	executorDatabase: ExecutorDatabase
): Promise<Pick<DflowCommonContext, "memory" | "memoryChanged">> => {
	const strategyFlow = await publicDatabase.ReadStrategyFlow(strategyKey)
	if (!strategyFlow)
		throw new ErrorStrategyItemNotFound({
			type: "StrategyFlow",
			...strategyKey
		})

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

	const { view } = strategyFlow
	if (!isDflowExecutorView(view))
		return {
			memoryChanged: false,
			memory: {}
		}

	const executor = new DflowBinanceExecutor()
	executor.nodesCatalog = nodesCatalog

	const {
		balance,
		memory: memoryOutput,
		memoryChanged,
		orders
	} = await executor.run(
		{
			binance,
			params,
			memory: memoryInput,
			time
		},
		view
	)

	const day = today()

	if (orders.length > 0) {
		const strategyOrders = orders.map((info) => newOrder(info))

		await executorDatabase.AppendStrategyDailyOrders({
			accountId,
			day,
			items: strategyOrders,
			...strategyKey
		})

		const accountOrders = strategyOrders.map((order) => ({
			order,
			...strategyKey
		}))

		await executorDatabase.AppendAccountDailyOrders({
			accountId,
			day,
			items: accountOrders
		})
	}

	if (balance.length > 0) {
		const balanceEvent: BalanceEvent = {
			balance,
			...strategyKey,
			...createdNow()
		}

		await executorDatabase.AppendAccountBalanceEvent({
			accountId,
			day,
			item: balanceEvent
		})
	}

	return {
		memoryChanged,
		memory: memoryOutput
	}
}
