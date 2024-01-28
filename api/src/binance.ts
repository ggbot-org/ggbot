import {
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType
} from "@workspace/binance"
import {
	AccountKey,
	BinanceApiConfig,
	BinanceApiKeyPermissionCriteria
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

type ClientAction = {
	CreateBinanceOrder: (arg: {
		symbol: string
		side: BinanceOrderSide
		type: Extract<BinanceOrderType, "MARKET">
		orderOptions: BinanceNewOrderOptions
	}) => Promise<BinanceOrderRespFULL>
	ReadBinanceAccountApiRestrictions: () => Promise<BinanceApiKeyPermissionCriteria>
}
export type BinanceClientActionType = keyof ClientAction

type DatabaseAction = {
	ReadBinanceApiConfig: (arg: AccountKey) => Promise<BinanceApiConfig | null>
}
export type BinanceDatabaseAction = DatabaseAction

type ClientInput = {
	CreateBinanceOrder: Parameters<ClientAction["CreateBinanceOrder"]>[0]
}

export type BinanceClientActionOutput = {
	CreateBinanceOrder: Awaited<ReturnType<ClientAction["CreateBinanceOrder"]>>
	ReadBinanceAccountApiRestrictions: Awaited<
		ReturnType<ClientAction["ReadBinanceAccountApiRestrictions"]>
	>
}

export type BinanceDatabaseActionOutput = {
	ReadBinanceApiConfig: Awaited<
		ReturnType<DatabaseAction["ReadBinanceApiConfig"]>
	>
}

export const isBinanceClientActionInput = {
	CreateBinanceOrder: objectTypeGuard<ClientInput["CreateBinanceOrder"]>(
		({ symbol, side, type, orderOptions }) =>
			typeof symbol === "string" &&
			typeof side === "string" &&
			typeof type === "string" &&
			!orderOptions &&
			typeof orderOptions === "object"
	)
}
