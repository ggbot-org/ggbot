import {
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
} from "@workspace/binance"
import {
	BinanceApiKeyPermissionCriteria,
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

type Action = {
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
export type BinanceDataprovider = Action

type ActionType = keyof Action
export type BinanceActionType = ActionType

type Input = {
	CreateBinanceOrder: Parameters<Action['CreateBinanceOrder']>[0]
	ReadBinanceAccountApiRestrictions: void
}
export type BinanceActionInput = Input

type Output = {
	CreateBinanceOrder: Awaited<ReturnType<Action['CreateBinanceOrder']>>
	ReadBinanceAccountApiRestrictions: Awaited<ReturnType<Action['ReadBinanceAccountApiRestrictions']>>
}
export type BinanceActionOutput = Output

export const binanceActionTypes = [
	"CreateBinanceOrder",
	"ReadBinanceAccountApiRestrictions"
] as const satisfies readonly ActionType[]

export const isBinanceActionInput = {
	CreateBinanceOrder: objectTypeGuard<Input["CreateBinanceOrder"]>(
		({ symbol, side, type, orderOptions }) =>
			typeof symbol === "string" &&
			typeof side === "string" &&
			typeof type === "string" &&
			!orderOptions &&
			typeof orderOptions === "object"
	)
}
