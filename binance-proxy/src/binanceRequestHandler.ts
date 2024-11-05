import { IncomingMessage } from "node:http"

import { binanceClientActions, isActionInput } from "@workspace/api"
import { ApiService, BinanceClientActionType, isBinanceClientActionInput as isInput } from "@workspace/api"
import { readSessionFromAuthorizationHeader } from "@workspace/authentication"
import { BinanceDatabase } from "@workspace/database"
import { BadRequestError } from "@workspace/http"
import { BinanceApiConfig, ErrorAccountItemNotFound, SerializableData } from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"

import { BinanceClient } from "./BinanceClient.js"

class BinanceService implements ApiService<BinanceClientActionType> {
	binance: BinanceClient

	constructor({ apiKey, apiSecret }: BinanceApiConfig) {
		this.binance = new BinanceClient(apiKey, apiSecret)
	}

	CreateBinanceOrder(arg: unknown) {
		if (!isInput.CreateBinanceOrder(arg)) throw new BadRequestError()
		const { symbol, side, type, orderOptions } = arg
		return this.binance.newOrder(symbol, side, type, orderOptions)
	}

	ReadBinanceAccountApiRestrictions() {
		return this.binance.apiRestrictions()
	}
}

export async function binanceRequestHandler(
	headers: IncomingMessage["headers"], body: string
): Promise<SerializableData> {
	const input: unknown = JSON.parse(body)
	if (!isActionInput(binanceClientActions)(input)) throw new BadRequestError()

	const { accountId } = await readSessionFromAuthorizationHeader(headers.authorization)

	const binanceDatabase = new BinanceDatabase({ accountId }, documentProvider)
	const binanceApiConfig = await binanceDatabase.ReadBinanceApiConfig()
	if (!binanceApiConfig) {
		throw new ErrorAccountItemNotFound({ type: "BinanceApiConfig", accountId })
	}

	const service = new BinanceService(binanceApiConfig)

	return service[input.type](input.data)
}
