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

import { readBinanceApiKeyPermissions } from "./binance.js"

export const dataProvider: UserApiDataProvider = {
	copyStrategy,
	createBinanceApiConfig,
	createStrategy,
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
