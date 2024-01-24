import {UserApiDataProvider} from "@workspace/api"
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
import {
	BinanceApiKeyPermissionCriteria,
	ErrorAccountItemNotFound,
	ErrorUnknownItem,
	welcomeFlow
} from "@workspace/models"


const readBinanceApiKeyPermissions = async (): Promise<BinanceApiKeyPermissionCriteria> => {
	// TODO
	return {
		enableReading: false,
		enableSpotAndMarginTrading: false,
		enableWithdrawals: false,
		ipRestrict: false,
	}
}

// TODO
const createPurchaseOrder: UserApiDataProvider["createPurchaseOrder"] = ({
	paymentProvider
}) => {
	if (paymentProvider === "stripe") return Promise.resolve(null)
	throw new ErrorUnknownItem("paymentProvider", paymentProvider)
}

const createStrategyWithWelcomeFlow: UserApiDataProvider["createStrategy"] =
	async ({accountId, kind, name}) => {
		const strategy = await createStrategy({accountId, kind, name})
		await writeStrategyFlow({
			accountId,
			view: welcomeFlow,
			strategyId: strategy.id,
			strategyKind: strategy.kind
		})
		return strategy
	}

const readAccountInfo: UserApiDataProvider["readAccountInfo"] = async (
	accountKey
) => {
	try {
		const account = await readAccount(accountKey)
		if (!account) return null
		const subscription = await readSubscription(accountKey)
		return {
			...account,
			subscription
		}
	} catch (error) {
		if (error instanceof ErrorAccountItemNotFound)
			if (error.type === "Account") return null
		throw error
	}
}

export const dataProvider: UserApiDataProvider = {
	copyStrategy,
	createBinanceApiConfig,
	createPurchaseOrder,
	createStrategy: createStrategyWithWelcomeFlow,
	deleteAccount,
	deleteBinanceApiConfig,
	deleteStrategy,
	readAccountInfo,
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
