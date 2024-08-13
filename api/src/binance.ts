import { BinanceNewOrderOptions, BinanceOrderRespFULL, BinanceOrderSide, BinanceOrderType } from "@workspace/binance"
import { AccountKey, BinanceApiConfig, BinanceApiKeyPermissionCriteria } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { Action, ActionTypes } from "./action.js"

type BinanceClientAction = {
	CreateBinanceOrder: (arg: {
		symbol: string
		side: BinanceOrderSide
		type: Extract<BinanceOrderType, "MARKET">
		orderOptions: BinanceNewOrderOptions
	}) => Promise<BinanceOrderRespFULL>
	ReadBinanceAccountApiRestrictions: (arg: void) => Promise<BinanceApiKeyPermissionCriteria>
}

export type BinanceClientActionType = keyof BinanceClientAction

export const binanceClientActions: ActionTypes<BinanceClientActionType> = [
	"CreateBinanceOrder",
	"ReadBinanceAccountApiRestrictions"
] as const

export type BinanceClientInput = {
	CreateBinanceOrder: Parameters<BinanceClientAction["CreateBinanceOrder"]>[0]
	ReadBinanceAccountApiRestrictions: Parameters<
		BinanceClientAction["ReadBinanceAccountApiRestrictions"]
	>[0]
}

export type BinanceClientOutput = {
	CreateBinanceOrder: Awaited<ReturnType<BinanceClientAction["CreateBinanceOrder"]>>
	ReadBinanceAccountApiRestrictions: Awaited<ReturnType<BinanceClientAction["ReadBinanceAccountApiRestrictions"]>>
}

export type BinanceDatabaseAction = {
	ReadBinanceApiConfig: Action<AccountKey, BinanceApiConfig | null>
}

export type BinanceDatabaseActionOutput = {
	ReadBinanceApiConfig: Awaited<
		ReturnType<BinanceDatabaseAction["ReadBinanceApiConfig"]>
	>
}

export const isBinanceClientActionInput = {
	CreateBinanceOrder: objectTypeGuard<
		BinanceClientInput["CreateBinanceOrder"]
	>(
		({ symbol, side, type, orderOptions }) => typeof symbol === "string" &&
			typeof side === "string" &&
			typeof type === "string" &&
			orderOptions !== null &&
			typeof orderOptions === "object"
	)
}
