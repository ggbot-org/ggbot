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
	SerializableData,
	Service
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

const operationNames = [
	"CreateBinanceOrder",
	"ReadBinanceAccountApiRestrictions"
] as const
type OperationName = (typeof operationNames)[number]

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

type Operation = {
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

type Input = {
	CreateBinanceOrder: Parameters<Operation["CreateBinanceOrder"]>[0]
	// ReadBinanceAccountApiRestrictions has no input arg
}

export type BinanceProxyApiInput = Input

type Output = {
	CreateBinanceOrder: Awaited<ReturnType<Operation["CreateBinanceOrder"]>>
	ReadBinanceAccountApiRestrictions: Awaited<
		ReturnType<Operation["ReadBinanceAccountApiRestrictions"]>
	>
}

export type BinanceProxyApiOutput = Output

export type BinanceProxyApiService = Service<OperationName>

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
