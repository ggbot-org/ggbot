import { BinanceExchangeInfoCacheMap } from "@ggbot2/binance"
import {
	appendAccountDailyOrders,
	appendStrategyDailyBalanceChanges,
	appendStrategyDailyOrders,
	Binance,
	readBinanceApiConfig,
	readStrategyFlow,
	readStrategyMemory,
	writeStrategyMemory
} from "@ggbot2/database"
import {
	BinanceDflowExecutor,
	getDflowBinanceNodesCatalog
} from "@ggbot2/dflow"
import {
	createdNow,
	ErrorAccountItemNotFound,
	ErrorStrategyItemNotFound,
	ErrorUnimplementedStrategyKind,
	newOrder,
	updatedNow
} from "@ggbot2/models"
import { now, timeToDay, today, truncateTime } from "@ggbot2/time"

import { ExecuteStrategy } from "./executeStrategy.js"

const exchangeInfoCache = new BinanceExchangeInfoCacheMap()

export const executeBinanceStrategy: ExecuteStrategy = async ({
	accountId,
	strategyId,
	strategyKind
}) => {
	try {
		const accountStrategyKey = { accountId, strategyKind, strategyId }
		const strategyKey = { strategyKind, strategyId }

		const strategyFlow = await readStrategyFlow(accountStrategyKey)
		if (!strategyFlow)
			throw new ErrorStrategyItemNotFound({
				type: "StrategyFlow",
				...strategyKey
			})

		const strategyMemory = await readStrategyMemory(accountStrategyKey)
		const memoryInput = strategyMemory?.memory ?? {}

		if (strategyKind === "binance") {
			const binanceApiConfig = await readBinanceApiConfig({ accountId })
			if (!binanceApiConfig)
				throw new ErrorAccountItemNotFound({
					type: "BinanceApiConfig",
					accountId
				})

			const { apiKey, apiSecret } = binanceApiConfig
			const binance = new Binance(apiKey, apiSecret, exchangeInfoCache)

			// Truncate logical time to minute. It is a good compromise also to
			// cache klines data.
			//
			// TODO is this correct?
			const time = truncateTime(now()).to.minute

			const { symbols } = await binance.exchangeInfo()
			const nodesCatalog = getDflowBinanceNodesCatalog(symbols)

			const executor = new BinanceDflowExecutor(
				binance,
				symbols,
				nodesCatalog
			)
			try {
				const {
					balances,
					execution,
					memory: memoryOutput,
					memoryChanged,
					orders
				} = await executor.run(
					{
						input: {},
						memory: memoryInput,
						time
					},
					strategyFlow.view
				)

				// Handle memory changes.
				if (memoryChanged)
					await writeStrategyMemory({
						accountId,
						strategyKind,
						strategyId,
						memory: memoryOutput
					})

				// TODO extract orders from execution
				// update order pools with orders that has temporary state
				// write other orders (e.g. filled) in history

				if (orders.length > 0) {
					const day = today()
					// TODO filter orders that are not filled, e.g. limit orders
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

				const status =
					execution?.status === "success" ? "success" : "failure"
				const steps = execution?.steps ?? []

				return { status, memory: memoryOutput, steps, ...updatedNow() }
			} catch (error) {
				console.error(error)
				return {
					status: "failure",
					memory: {},
					steps: [],
					...updatedNow()
				}
			}
		}
		throw new ErrorUnimplementedStrategyKind({ strategyKind, strategyId })
	} catch (error) {
		if (
			error instanceof ErrorAccountItemNotFound ||
			error instanceof ErrorUnimplementedStrategyKind
		)
			throw error
		console.error(error)
		throw error
	}
}
