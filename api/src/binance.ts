import {
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
} from "@workspace/binance"
import {
	AccountKey,
	BinanceApiConfig,
	BinanceApiKeyPermissionCriteria,
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"
import {ActionInputValidators, __noInput} from "./action"

type ClientAction = {
	CreateBinanceOrder: (arg: {
		symbol: string
		side: BinanceOrderSide
		type: Extract<BinanceOrderType, "MARKET">
		orderOptions: BinanceNewOrderOptions
	}) => Promise<BinanceOrderRespFULL>
	ReadBinanceAccountApiRestrictions: () => Promise<
		BinanceApiKeyPermissionCriteria
	>
}
export type BinanceClientAction = DatabaseAction
export type BinanceClientActionType = keyof ClientAction

type DatabaseAction = {
	ReadBinanceApiConfig: ( arg: AccountKey) => Promise<BinanceApiConfig | null>
}
export type BinanceDatabaseAction = DatabaseAction
export type BinanceDatabaseActionType = keyof DatabaseAction

type ClientInput = {
	CreateBinanceOrder: Parameters<ClientAction['CreateBinanceOrder']>[0]
	ReadBinanceAccountApiRestrictions: void
}
export type BinanceClientActionInput = ClientInput

type DatabaseInput = {
	ReadBinanceApiConfig: void
}
export type BinanceDatabaseActionInput = DatabaseInput

export type BinanceClientActionOutput = {
	CreateBinanceOrder: Awaited<ReturnType<ClientAction['CreateBinanceOrder']>>
	ReadBinanceAccountApiRestrictions: Awaited<ReturnType<ClientAction['ReadBinanceAccountApiRestrictions']>>
}

export type BinanceDatabaseActionOutput = {
	ReadBinanceApiConfig: Awaited<ReturnType<DatabaseAction['ReadBinanceApiConfig']>>
}

export const isBinanceClientActionInput = {
	CreateBinanceOrder: objectTypeGuard<ClientInput["CreateBinanceOrder"]>(
		({ symbol, side, type, orderOptions }) =>
			typeof symbol === "string" &&
			typeof side === "string" &&
			typeof type === "string" &&
			!orderOptions &&
			typeof orderOptions === "object"
	),
	ReadBinanceAccountApiRestrictions: __noInput
} satisfies ActionInputValidators<BinanceClientActionType>

export const isBinanceDatabaseActionInput = {
	ReadBinanceApiConfig: __noInput
} satisfies ActionInputValidators<BinanceDatabaseActionType>
