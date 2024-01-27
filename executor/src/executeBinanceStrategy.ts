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
	ErrorStrategyItemNotFound,
	newOrder,
	StrategyKey,
	StrategyScheduling
} from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"
import { now, today, truncateTime } from "minimal-time-helpers"

import { Binance } from "./binance.js"

const ONE_WEEK = 604_800_000
const exchangeInfoCache = new BinanceExchangeInfoCacheMap()
const klinesCache = new BinanceKlinesCacheMap(ONE_WEEK)

const publicDatabase = new PublicDatabase(documentProvider)
const executorDatabase = new ExecutorDatabase(documentProvider)

export const executeBinanceStrategy = async (
	{ accountId, strategyId }: Omit<AccountStrategyKey, "strategyKind">,
	scheduling: StrategyScheduling
): Promise<
	{ success: boolean } & Pick<DflowCommonContext, "memory" | "memoryChanged">
> => {
	const strategyKey: StrategyKey = { strategyKind: "binance", strategyId }

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
			success: false,
			memoryChanged: false,
			memory: {}
		}

	const executor = new DflowBinanceExecutor()
	executor.nodesCatalog = nodesCatalog

	const {
		// TODO balances,
		execution,
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

	if (orders.length > 0) {
		const day = today()
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

	// TODO
	// if (balances.length > 0) {
	// 	const {whenCreated} = createdNow()
	// 	const day = timeToDay(truncateTime(whenCreated).to.day)
	// 	await appendStrategyDailyBalanceChanges({
	// 		accountId,
	// 		day,
	// 		items: [{whenCreated, balances}],
	// 		...strategyKey,
	// 	})
	// }

	return {
		success: execution?.status === "success",
		memoryChanged,
		memory: memoryOutput
	}
}
