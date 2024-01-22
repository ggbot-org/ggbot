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
import {objectTypeGuard} from "minimal-type-guard-helpers"

import {Service} from "./service.js"

const binanceProxyApiActionTypes = [
	"CreateBinanceOrder",
	"ReadBinanceAccountApiRestrictions"
] as const
type BinanceProxyApiActionType = (typeof binanceProxyApiActionTypes)[number]

export type BinanceProxyApiResponseError = Pick<Response, 'status'> & {
	error: BinanceErrorPayload
}

export const isBinanceProxyApiResponseError = objectTypeGuard<BinanceProxyApiResponseError>(({
	status,
	error
}) => (typeof status === 'number' && isBinanceErrorPayload(error)))

export type BinanceProxyApiResponseOutput<Data extends SerializableData> = {
	data: Data
}

type Input = {
	CreateBinanceOrder: {
		symbol: string
		side: BinanceOrderSide
		type: Extract<BinanceOrderType, "MARKET">
		orderOptions: BinanceNewOrderOptions
	}
	ReadBinanceAccountApiRestrictions: void
}

export type BinanceProxyApiInput = Input

type Operation = {
	CreateBinanceOrder: (arg: Input['CreateBinanceOrder']) => Promise<BinanceOrderRespFULL>
	ReadBinanceAccountApiRestrictions: (arg: Input['ReadBinanceAccountApiRestrictions']) => Promise<BinanceApiKeyPermissionCriteria>
}

export type BinanceProxyApiDataProviderOperation = Operation

export type BinanceProxyApiDataProvider = {
	createBinanceOrder: Operation['CreateBinanceOrder']
	readBinanceAccountApiRestrictions: Operation['ReadBinanceAccountApiRestrictions']
}

export type BinanceProxyApiService = Service<
	BinanceProxyApiActionType,
	BinanceProxyApiDataProvider
>

export const isBinanceProxyApiInput = {
	CreateBinanceOrder: objectTypeGuard<Input['CreateBinanceOrder']>(
		({symbol, side, type, orderOptions}) =>
			typeof symbol === "string" &&
			typeof side === "string" &&
			typeof type === "string" &&
			!orderOptions &&
			typeof orderOptions === "object"
	),
	ReadBinanceAccountApiRestrictions: () => true
} satisfies Record<BinanceProxyApiActionType, (arg: unknown) => boolean>
