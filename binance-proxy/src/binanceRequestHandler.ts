import { IncomingMessage } from 'node:http'

import {
	ApiService,
	BadRequestError,
	binanceClientActions,
	BinanceClientActionType,
	isActionInput,
	isBinanceClientActionInput as isInput,
	UNAUTHORIZED__401,
} from '@workspace/api'
import { readSessionFromAuthorizationHeader } from '@workspace/authentication'
import { BinanceDatabase } from '@workspace/database'
import {
	BinanceApiConfig,
	ErrorAccountItemNotFound,
	SerializableData,
} from '@workspace/models'
import { documentProvider } from '@workspace/s3-data-bucket'

import { BinanceClient } from './BinanceClient.js'

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
	headers: IncomingMessage['headers'],
	body: string
): Promise<SerializableData> {
	const input: unknown = JSON.parse(body)
	if (!isActionInput(binanceClientActions)(input)) throw new BadRequestError()

	const session = await readSessionFromAuthorizationHeader(
		headers.authorization
	)
	if (!session) return UNAUTHORIZED__401
	const { accountId } = session

	const binanceDatabase = new BinanceDatabase({ accountId }, documentProvider)
	const binanceApiConfig = await binanceDatabase.ReadBinanceApiConfig()
	if (!binanceApiConfig)
		throw new ErrorAccountItemNotFound({ type: 'BinanceApiConfig', accountId })

	const service = new BinanceService(binanceApiConfig)

	return service[input.type](input.data)
}
