import {
	BinanceAccountInformation,
	BinanceApiKeyPermission,
	BinanceApiPrivateEndpoint,
	BinanceErrorPayload,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType
} from "@workspace/binance"
import { SerializableData } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { Service } from "./service.js"

const binanceApiActionTypes = [
	"CreateBinanceOrder",
	"ReadBinanceAccountApiRestrictions"
] as const
type BinanceApiActionType = (typeof binanceApiActionTypes)[number]

export type BinanceApiResponseOutput<Data extends SerializableData> = {
	status: number
	data?: Data
	error?: BinanceErrorPayload
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

type ReadBinanceAccountApiRestrictions = () => Promise<BinanceApiKeyPermission>

export type BinanceApiDataProvider = {
	action: (
		endpoint: BinanceApiPrivateEndpoint
	) => Promise<BinanceApiResponseOutput<SerializableData>>
	createBinanceOrder: CreateBinanceOrder
	createBinanceOrderTest: CreateBinanceOrder
	readBinanceAccount: ReadBinanceAccount
	readBinanceAccountApiRestrictions: ReadBinanceAccountApiRestrictions
}

export type BinanceApiService = Service<
	BinanceApiActionType,
	BinanceApiDataProvider
>
