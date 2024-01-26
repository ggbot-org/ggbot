import {
	BinanceErrorPayload,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	isBinanceErrorPayload
} from "@workspace/binance"
import {
	BinanceApiKeyPermissionCriteria,
	SerializableData
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

const actionTypes = [
	"CreateBinanceOrder",
	"ReadBinanceAccountApiRestrictions"
] as const
type ActionType = (typeof actionTypes)[number]
export type BinanceProxyApiActionType = ActionType

export type BinanceProxyApiResponseError = Pick<Response, "status"> & {
	error: BinanceErrorPayload
}

export const isBinanceProxyApiResponseError =
	objectTypeGuard<BinanceProxyApiResponseError>(
		({ status, error }) =>
			typeof status === "number" && isBinanceErrorPayload(error)
	)

export type BinanceProxyApiResponseOutput<Data extends SerializableData> = {
	data: Data
}

type Action = {
	CreateBinanceOrder: (arg: {
		symbol: string
		side: BinanceOrderSide
		type: Extract<BinanceOrderType, "MARKET">
		orderOptions: BinanceNewOrderOptions
	}) => Promise<BinanceOrderRespFULL | BinanceProxyApiResponseError>
	ReadBinanceAccountApiRestrictions: () => Promise<
		BinanceApiKeyPermissionCriteria | BinanceProxyApiResponseError
	>
}

export type BinanceProxyApiAction = Action

type Input = {
	CreateBinanceOrder: Parameters<Action["CreateBinanceOrder"]>[0]
}

export type BinanceProxyApiInput = Input

type Output = {
	CreateBinanceOrder: Awaited<ReturnType<Action["CreateBinanceOrder"]>>
	ReadBinanceAccountApiRestrictions: Awaited<
		ReturnType<Action["ReadBinanceAccountApiRestrictions"]>
	>
}

export type BinanceProxyApiOutput = Output

export const isBinanceProxyApiInput = {
	CreateBinanceOrder: objectTypeGuard<Input["CreateBinanceOrder"]>(
		({ symbol, side, type, orderOptions }) =>
			typeof symbol === "string" &&
			typeof side === "string" &&
			typeof type === "string" &&
			!orderOptions &&
			typeof orderOptions === "object"
	)
}
