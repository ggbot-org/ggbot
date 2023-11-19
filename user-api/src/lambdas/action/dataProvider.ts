import { UserApiDataProvider } from "@workspace/api"
import {
	copyStrategy,
	createBinanceApiConfig,
	createStrategy,
	deleteAccount,
	deleteBinanceApiConfig,
	deleteStrategy,
	readAccount,
	readAccountStrategies,
	readBinanceApiKey,
	readStrategyBalances,
	readStrategyOrders,
	readSubscription,
	renameAccount,
	renameStrategy,
	setAccountCountry,
	writeAccountStrategiesItemSchedulings,
	writeStrategyFlow
} from "@workspace/database"
import { welcomeFlow } from "@workspace/models"

import { readBinanceApiKeyPermissions } from "./binance.js"

const createStrategyWithWelcomeFlow: UserApiDataProvider["createStrategy"] =
	async ({ accountId, kind, name }) => {
		const strategy = await createStrategy({ accountId, kind, name })
		await writeStrategyFlow({
			accountId,
			view: welcomeFlow,
			strategyId: strategy.id,
			strategyKind: strategy.kind
		})
		return strategy
	}

export const dataProvider: UserApiDataProvider = {
	copyStrategy,
	createBinanceApiConfig,
	createStrategy: createStrategyWithWelcomeFlow,
	deleteAccount,
	deleteBinanceApiConfig,
	deleteStrategy,
	readAccount,
	readAccountStrategies,
	readBinanceApiKey,
	readBinanceApiKeyPermissions,
	readStrategyBalances,
	readStrategyOrders,
	readSubscription,
	renameAccount,
	renameStrategy,
	setAccountCountry,
	writeAccountStrategiesItemSchedulings,
	writeStrategyFlow
}
