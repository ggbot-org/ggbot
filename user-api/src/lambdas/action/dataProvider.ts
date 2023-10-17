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
	readStrategyOrders,
	readSubscription,
	renameAccount,
	renameStrategy,
	writeAccountStrategiesItemSchedulings,
	writeStrategyFlow,
} from "@workspace/database"

export const dataProvider: UserApiDataProvider = {
	copyStrategy,
	createBinanceApiConfig,
	createStrategy,
	deleteAccount,
	deleteBinanceApiConfig,
	deleteStrategy,
	readAccount,
	readAccountStrategies,
	readStrategyOrders,
	readSubscription,
	renameAccount,
	renameStrategy,
	writeAccountStrategiesItemSchedulings,
	writeStrategyFlow,
}
