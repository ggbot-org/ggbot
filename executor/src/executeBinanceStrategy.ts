import {
	BinanceExchangeInfoCacheMap,
	BinanceKlinesCacheMap
} from "@workspace/binance"
import {
	appendAccountDailyOrders,
	appendStrategyDailyBalanceChanges,
	appendStrategyDailyOrders,
	readBinanceApiConfig,
	readStrategyFlow
} from "@workspace/database"
import {
	DflowBinanceExecutor,
	DflowCommonContext,
	getDflowBinanceNodesCatalog,
	isDflowExecutorView
} from "@workspace/dflow"
import {
	AccountStrategyKey,
	createdNow,
	ErrorAccountItemNotFound,
	ErrorStrategyItemNotFound,
	newOrder,
	StrategyKind,
	StrategyScheduling} from "@workspace/models"
import { now, timeToDay, today, truncateTime } from "minimal-time-helpers"

import { Binance } from "./binance.js"

const ONE_WEEK = 604_800_000
const exchangeInfoCache = new BinanceExchangeInfoCacheMap()
const klinesCache = new BinanceKlinesCacheMap(ONE_WEEK)

export const executeBinanceStrategy = async (
	{ accountId, strategyId }: Omit<AccountStrategyKey, "strategyKind">,
	scheduling: StrategyScheduling
): Promise<
	{ success: boolean } & Pick<DflowCommonContext, "memory" | "memoryChanged">
> => {
	const strategyKind: StrategyKind = "binance"
	const accountStrategyKey = { accountId, strategyKind, strategyId }
	const strategyKey = { strategyKind, strategyId }

	const strategyFlow = await readStrategyFlow(accountStrategyKey)
	if (!strategyFlow)
		throw new ErrorStrategyItemNotFound({
			type: "StrategyFlow",
			...strategyKey
		})

	const memoryInput = scheduling.memory ?? {}
	const params = scheduling.params ?? {}

	const binanceApiConfig = await readBinanceApiConfig({ accountId })
	if (!binanceApiConfig)
		throw new ErrorAccountItemNotFound({
			type: "BinanceApiConfig",
			accountId
		})

	const { apiKey, apiSecret } = binanceApiConfig
	const binance = new Binance(apiKey, apiSecret)
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
		balances,
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

		await appendStrategyDailyOrders({
			accountId,
			strategyKind,
			strategyId,
			day,
			items: strategyOrders
		})

		const accountOrders = strategyOrders.map((order) => ({
			order,
			strategyKind,
			strategyId
		}))

		await appendAccountDailyOrders({
			accountId,
			day,
			items: accountOrders
		})
	}

	if (balances.length > 0) {
		const { whenCreated } = createdNow()
		const day = timeToDay(truncateTime(whenCreated).to.day)
		await appendStrategyDailyBalanceChanges({
			accountId,
			strategyKind,
			strategyId,
			day,
			items: [{ whenCreated, balances }]
		})
	}

	return {
		success: execution?.status === "success",
		memoryChanged,
		memory: memoryOutput
	}
}
