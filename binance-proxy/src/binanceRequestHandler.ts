import { IncomingMessage } from "node:http"

import { binanceClientActions, isActionInput } from "@workspace/api"
import { readSessionFromAuthorizationHeader } from "@workspace/authentication"
import { BinanceDatabase } from "@workspace/database"
import { BadRequestError } from "@workspace/http"
import { ErrorAccountItemNotFound, SerializableData } from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"

import { BinanceService } from "./binanceService.js"

export const binanceRequestHandler = async (
	headers: IncomingMessage["headers"],
	body: string
): Promise<SerializableData> => {
	const input: unknown = JSON.parse(body)
	if (!isActionInput(binanceClientActions)(input)) throw new BadRequestError()

	const { accountId } = await readSessionFromAuthorizationHeader(
		headers.authorization
	)

	const binanceDatabase = new BinanceDatabase({ accountId }, documentProvider)
	const binanceApiConfig = await binanceDatabase.ReadBinanceApiConfig()
	if (!binanceApiConfig) throw new ErrorAccountItemNotFound({
		type: "BinanceApiConfig",
		accountId
	})

	const { apiKey, apiSecret } = binanceApiConfig
	const service = new BinanceService(apiKey, apiSecret)

	return service[input.type](input.data)
}
