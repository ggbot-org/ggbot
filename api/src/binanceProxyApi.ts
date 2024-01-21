import {
	BinanceAccountInformation,
	BinanceErrorPayload,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	isBinanceErrorPayload
} from "@workspace/binance"
import {
	BinanceApiKeyPermissionCriteria,
	SerializableData } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { Service } from "./service.js"

const binanceProxyApiActionTypes = [
	"CreateBinanceOrder",
	"ReadBinanceAccountApiRestrictions"
] as const
type BinanceProxyApiActionType = (typeof binanceProxyApiActionTypes)[number]

export type BinanceProxyApiResponseError = Pick<Response, 'status'>  & {
	error: BinanceErrorPayload
}

export const isBinanceProxyApiResponseError = objectTypeGuard<BinanceProxyApiResponseError>(( {
	status,
	error
}) => (typeof status === 'number' && isBinanceErrorPayload(error)))

export type BinanceProxyApiResponseOutput<Data extends SerializableData> = {
	data: Data
}

export type CreateBinanceOrderInput = {
	symbol: string
	side: BinanceOrderSide
	type: Extract<BinanceOrderType, "MARKET">
	orderOptions: BinanceNewOrderOptions
}

export const isCreateBinanceOrderInput =
	objectTypeGuard<CreateBinanceOrderInput>(
		({ symbol, side, type, orderOptions }) =>
			typeof symbol === "string" &&
			typeof side === "string" &&
			typeof type === "string" &&
			!orderOptions &&
			typeof orderOptions === "object"
	)

type CreateBinanceOrder = (
	arg: CreateBinanceOrderInput
) => Promise<BinanceOrderRespFULL>

type ReadBinanceAccount = () => Promise<BinanceAccountInformation>

type ReadBinanceAccountApiRestrictions = () => Promise<BinanceApiKeyPermissionCriteria>

export type BinanceProxyApiDataProvider = {
	createBinanceOrder: CreateBinanceOrder
	createBinanceOrderTest: CreateBinanceOrder
	readBinanceAccount: ReadBinanceAccount
	readBinanceAccountApiRestrictions: ReadBinanceAccountApiRestrictions
}

export type BinanceProxyApiService = Service<
	BinanceProxyApiActionType,
	BinanceProxyApiDataProvider
>
